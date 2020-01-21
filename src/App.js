import React from 'react';
// import logo from './logo.svg';
import './App.css';

// Async response function
async function makeRequest(url) {
  const response = await fetch(url);

  if (
    response.ok &&
    response.headers.get("content-type").startsWith("application/json")
  ) {
    const data = await response.json();
    return data;
  }

  throw new Error("Unexpected error.");
}

// Function to show post author
function findUser(
  users,
  userID
) {
  const userIndex = users.findIndex(user => user.id === userID);
  const author = users[userIndex].name;
  return author;
}

const Comments = ({ comments }) => (
  <div className="comments-container">
  <h2>Comments</h2>
  {comments.map(comment => (
      <div key={comment.id} className="comment-block">
        <h3>{comment.email}</h3>
        <p>{comment.name}</p>
      </div>
  ))}
  </div>
);

export class Post extends React.Component {
  state = {
    post: null,
    comments: null,
    isLoading: true,
    isError: false
  };

  async getPost() {
    this.setState({
      isLoading: true,
      isError: false,
      posts: null,
      comments: null
    });

    try {
      const post = await makeRequest(
        `https://jsonplaceholder.typicode.com/posts?id=${this.props.postId}`
      );
      const comments = await makeRequest(
        `https://jsonplaceholder.typicode.com/comments?postId=${this.props.postId}`
      );

      console.log(comments);

      this.setState({
        isLoading: false,
        post,
        comments
      });
    } catch (e) {
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  }

  componentDidMount() {
    this.getPost();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.postId !== prevProps.postId) {
      this.getPost();
    }
  }

  render() {
    if (this.state.isError) {
      return "Unexpected error";
    }

    if (this.state.isLoading) {
      return "...Loading...";
    }

    return (
      <React.Fragment>
        <div className="post-page"> 
          <h1>{this.state.post[0].title}</h1>
          <div>{this.state.post[0].body}</div>
          <div className="author">{this.props.postUser}</div>
        </div> 
        <Comments comments={this.state.comments} />
      </React.Fragment>
    );
  }

  
}

class Posts extends React.Component {
  state = {
    activePostId: null,
    activePostUser: null
    // activePostTitle: null,
    // activePostAuthor: null
  };

  render() {
    if (this.state.activePostId){
      return (
        <React.Fragment> 
          <button
            className="back"
            onClick={() => this.setState({ 
              activePostId: null,
              activePostUser: null
            })}
          >
            Show all posts
          </button>
          <Post 
            postId={this.state.activePostId}
            postUser={this.state.activePostUser}
            users={this.props.users}
          />
        </React.Fragment> 
      );
    } else {
      return (
        <React.Fragment>          
            {this.props.posts.map(post => (
              <div
                id={post.id}
                key={post.id}
                className="post-preview"
                onClick={() => this.setState({ 
                  activePostId: post.id,
                  activePostUser: findUser(this.props.users, post.userId)
                })}
              >
                <h6>{findUser(this.props.users, post.userId)}</h6>
                <h4>{post.title}</h4>
              </div>
            ))} 
        </React.Fragment>
      );
    }
  }
}

class PostsContainer extends React.Component {
  state = {
    posts: null,
    isLoading: true,
    isError: false
  };

  async componentDidMount() {
    try {
      const posts = await makeRequest(
        "https://jsonplaceholder.typicode.com/posts"
      );

      const users = await makeRequest(
        "https://jsonplaceholder.typicode.com/users"
      );

      this.setState({
        isLoading: false,
        posts,
        users
      });
    } catch (e) {
      this.setState({
        isLoading: false,
        isError: true
      });
    }
  }

  render() {
    if (this.state.isError) {
      return "Unexpected error";
    }

    if (this.state.isLoading) {
      return "...Loading...";
    }

    return <Posts posts={this.state.posts} users={this.state.users} />;
  }
}

function App() {
  return (
      <PostsContainer />
  );
}

export default App;
