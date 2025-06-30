import pandas as pd
from collections import Counter
import re
from textblob import TextBlob
from wordcloud import WordCloud
import base64
import io
import uuid
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.express as px

# --- Core Analysis Functions ---

def count_messages_by_author(df):
    return df['Author'].value_counts().to_dict()

def messages_by_day_of_week(df):
    df['DayOfWeek'] = df['Time'].dt.day_name()
    order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    daily_counts = df.groupby(['Author', 'DayOfWeek']).size().unstack(fill_value=0)
    # Reorder columns to be in chronological order
    if all(day in daily_counts.columns for day in order):
        daily_counts = daily_counts[order]
    return daily_counts.to_dict('index')

def response_time_analysis(df):
    df_sorted = df.sort_values('Time').copy()
    df_sorted['TimeDiff'] = df_sorted['Time'].diff()
    df_sorted['PrevAuthor'] = df_sorted['Author'].shift(1)
    
    responses = df_sorted[df_sorted['Author'] != df_sorted['PrevAuthor']].copy()
    responses['ResponseMinutes'] = responses['TimeDiff'].dt.total_seconds() / 60
    responses = responses[responses['ResponseMinutes'] < 1440] # Filter out gaps > 24h
    
    if responses.empty:
        return {}
    return responses.groupby('Author')['ResponseMinutes'].describe()[['mean', '50%', 'min', 'max']].rename(columns={'50%': 'median'}).to_dict('index')

def love_words_analysis(df):
    love_words = ['love', 'baby', 'babe', 'honey', 'sweetheart', 'darling', 'miss', 'zemer', 'bb', 'shpirt', 'syn', 'dashni', 'dashuri', 'bukuroshe']
    results = {}
    for author in df['Author'].unique():
        author_texts = df[df['Author'] == author]['Text'].str.lower().str.cat(sep=' ')
        count = sum(author_texts.count(word) for word in love_words)
        results[author] = count
    return results

def overall_busiest_days(df):
    df['Date'] = df['Time'].dt.date
    daily_totals = df.groupby('Date').size().sort_values(ascending=False)
    return [{"date": str(date), "count": count} for date, count in daily_totals.head(10).items()]

def conversation_starters(df):
    df_sorted = df.sort_values('Time').copy()
    df_sorted['TimeDiff'] = df_sorted['Time'].diff()
    is_new_conversation = (df_sorted['TimeDiff'] > pd.Timedelta(hours=2))
    starters = df_sorted[is_new_conversation]['Author'].value_counts()
    return starters.to_dict()

def emoji_usage(df):
    emoji_pattern = re.compile("[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\U00002702-\U000027B0\U000024C2-\U0001F251]+")
    results = {}
    for author in df['Author'].unique():
        author_texts = df[df['Author'] == author]['Text'].str.cat(sep=' ')
        emojis = emoji_pattern.findall(author_texts)
        results[author] = len(emojis)
    return results

def question_vs_statement_ratio(df):
    results = {}
    for author in df['Author'].unique():
        author_df = df[df['Author'] == author]
        total_messages = len(author_df)
        if total_messages == 0:
            results[author] = {"total": 0, "questions": 0}
            continue
        questions = author_df['Text'].str.contains(r'\?', regex=True).sum()
        results[author] = {"total": int(total_messages), "questions": int(questions)}
    return results

def top_k_words_by_author(df, k=10):
    # Same as before
    stop_words = set(['the', 'to', 'and', 'a', 'of', 'it', 'in', 'you', 'that', 'i', 'is', 'for', 'on', 'are', 'with', 'as', 'this', 'was', 'we', 'be', 'have', 'but', 'not', 'your', 'so', 'me', 'my', 'at', 'he', 'she', 'all', 'omitted', 'media', 'message', 'deleted', 'ok', 'okay', 'yeah', 'lol', 'im', 'its', 'dont', 'yes', 'no'])
    results = {}
    for author in df['Author'].unique():
        author_texts = df[df['Author'] == author]['Text'].str.cat(sep=' ')
        words = re.findall(r'\b[a-zA-Z]{3,}\b', author_texts.lower())
        meaningful_words = [word for word in words if word not in stop_words and len(word) > 2]
        word_counts = Counter(meaningful_words)
        results[author] = [{"word": word, "count": count} for word, count in word_counts.most_common(k)]
    return results

def sentiment_analysis_by_author(df):
    # Same as before
    def get_sentiment(text):
        polarity = TextBlob(text).sentiment.polarity
        if polarity > 0.1: return 'Positive'
        elif polarity < -0.1: return 'Negative'
        else: return 'Neutral'
    df['Sentiment'] = df['Text'].apply(get_sentiment)
    sentiment_counts = df.groupby(['Author', 'Sentiment']).size().unstack(fill_value=0)
    return sentiment_counts.to_dict('index')

# --- Plot & Image Generation ---

def create_wordcloud_image(df, author):
    # Same as before
    stop_words = set(['the', 'to', 'and', 'a', 'of', 'it', 'in', 'you', 'that', 'i', 'is', 'for', 'on', 'are', 'with', 'as', 'this', 'was', 'we', 'be', 'have', 'but', 'not', 'your', 'so', 'me', 'my', 'at', 'he', 'she', 'all', 'omitted', 'media', 'message', 'deleted', 'ok', 'okay', 'yeah', 'lol', 'im', 'its', 'dont', 'yes', 'no'])
    author_data = df[df['Author'] == author]
    if author_data.empty: return ""
    text = ' '.join(author_data['Text'].astype(str))
    cleaned_text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE).lower()
    if not cleaned_text.strip(): return ""
    wordcloud = WordCloud(width=800, height=400, background_color='white', max_words=100, stopwords=stop_words, colormap='viridis').generate(cleaned_text)
    filename = f"wordcloud_{author.replace(' ', '_')}_{uuid.uuid4().hex[:8]}.png"
    filepath = f"temp_images/{filename}"
    wordcloud.to_image().save(filepath)
    return f"/images/{filename}"

def create_message_distribution_chart(message_counts):
    authors = list(message_counts.keys())
    counts = list(message_counts.values())
    fig = px.bar(x=authors, y=counts, labels={'x': 'Author', 'y': 'Number of Messages'}, title='Message Distribution')
    fig.update_layout(template='plotly_white')
    return fig.to_json()

def create_sentiment_pies(sentiment_data):
    authors = list(sentiment_data.keys())
    if not authors: return None
    
    specs = [[{'type': 'domain'}] * len(authors)]
    fig = make_subplots(rows=1, cols=len(authors), specs=specs, subplot_titles=authors)
    
    for i, author in enumerate(authors):
        labels = list(sentiment_data[author].keys())
        values = list(sentiment_data[author].values())
        fig.add_trace(go.Pie(labels=labels, values=values, name=author), 1, i + 1)
        
    fig.update_traces(hole=.4, hoverinfo="label+percent+name")
    fig.update_layout(title_text="Sentiment Analysis by Author", template='plotly_white')
    return fig.to_json()
    
def create_love_words_chart(love_words_data):
    authors = list(love_words_data.keys())
    counts = list(love_words_data.values())
    fig = px.bar(x=authors, y=counts, labels={'x': 'Author', 'y': 'Love Words Count'}, title='Love Words Analysis', color_discrete_sequence=['#FF69B4'])
    fig.update_layout(template='plotly_white')
    return fig.to_json()

# ... (create_interactive_timeline and create_hourly_heatmap are the same) ...
def create_interactive_timeline(df):
    df['Date'] = df['Time'].dt.date
    timeline_data = df.groupby(['Date', 'Author']).size().unstack(fill_value=0)
    fig = go.Figure()
    for author in timeline_data.columns:
        fig.add_trace(go.Scatter(
            x=timeline_data.index, y=timeline_data[author],
            mode='lines', name=author, stackgroup='one'
        ))
    fig.update_layout(title='Conversation Activity Timeline', template='plotly_white', hovermode='x unified')
    return fig.to_json()

def create_hourly_heatmap(df):
    df['Hour'] = df['Time'].dt.hour
    hourly_data = df.groupby(['Author', 'Hour']).size().unstack(fill_value=0)
    peak_hour = hourly_data.sum().idxmax()
    peak_msg_count = hourly_data.sum().max()
    fig = go.Figure(data=go.Heatmap(
        z=hourly_data.values,
        x=hourly_data.columns,
        y=hourly_data.index,
        colorscale='Viridis'
    ))
    fig.update_layout(title='Hourly Activity Patterns', xaxis_title='Hour of Day', template='plotly_white')
    return fig.to_json(), peak_hour, peak_msg_count

# --- Main Orchestration Function ---

def generate_full_analysis(file_content: str):
    df = pd.read_json(io.StringIO(file_content), orient='split')
    df['Time'] = pd.to_datetime(df['Time'])
    authors = df['Author'].unique().tolist()
    total_messages = len(df)
    
    # Run all analyses
    message_counts = count_messages_by_author(df)
    days_analyzed = (df['Time'].max() - df['Time'].min()).days
    avg_msg_per_day = total_messages / days_analyzed if days_analyzed > 0 else total_messages
    most_active_author = max(message_counts, key=message_counts.get) if message_counts else "N/A"
    most_active_percent = (message_counts[most_active_author] / total_messages * 100) if total_messages > 0 else 0
    sentiment_data = sentiment_analysis_by_author(df)
    love_words_data = love_words_analysis(df)
    love_words_leader = max(love_words_data, key=love_words_data.get) if love_words_data else "N/A"
    heatmap_plot, peak_hour, peak_msg_count = create_hourly_heatmap(df)

    return {
        "metadata": {
            "total_messages": total_messages,
            "participants": authors,
            "period_days": days_analyzed,
            "avg_messages_per_day": round(avg_msg_per_day, 1),
            "date_range": {
                "start": df['Time'].min().strftime('%B %d, %Y'),
                "end": df['Time'].max().strftime('%B %d, %Y')
            }
        },
        "insights": {
            "message_distribution": {
                "most_active_author": most_active_author,
                "most_active_count": message_counts.get(most_active_author, 0),
                "most_active_percent": round(most_active_percent, 1)
            },
            "hourly_activity": {
                "peak_hour": f"{peak_hour:02d}:00 - {peak_hour+1:02d}:00",
                "peak_msg_count": int(peak_msg_count)
            },
            "love_words": {
                "leader": love_words_leader,
                "count": love_words_data.get(love_words_leader, 0)
            }
        },
        "tables": {
            "day_of_week": messages_by_day_of_week(df),
            "response_time": response_time_analysis(df),
            "busiest_days": overall_busiest_days(df),
        },
        "patterns": {
            "conversation_starters": conversation_starters(df),
            "emoji_usage": emoji_usage(df),
            "question_ratio": question_vs_statement_ratio(df),
        },
        "plots": {
            "message_distribution": create_message_distribution_chart(message_counts),
            "sentiment_pies": create_sentiment_pies(sentiment_data),
            "love_words": create_love_words_chart(love_words_data),
            "timeline": create_interactive_timeline(df),
            "hourly_heatmap": heatmap_plot,
        },
        "words": {
            "top_words": top_k_words_by_author(df, 10),
            "wordclouds": { author: create_wordcloud_image(df, author) for author in authors }
        }
    }