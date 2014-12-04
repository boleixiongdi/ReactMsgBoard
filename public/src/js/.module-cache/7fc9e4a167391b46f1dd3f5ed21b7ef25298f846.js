var data = [
	{author: "Jack", msg: "Hello, Rose!"},
	{author: "Rose", msg: "You jump,I jump!"}
];

var Comment = React.createClass({displayName: 'Comment',
	render: function() {
		return (
			React.createElement("div", {className: "comment"}, 
				React.createElement("p", {className: "comment-name"}, this.props.author, " 15:30"), 
				
				React.createElement("div", {className: "comment-body"}, 
					this.props.children
				)
			)
		);
	}
});

var CommentList = React.createClass({displayName: 'CommentList',
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				React.createElement(Comment, {author: comment.author}, 
					comment.msg
				)
			);
		});
		
		return (
			React.createElement("div", {className: "comment-list"}, 
				commentNodes
			)
		);
	}
});

var CommentForm = React.createClass({displayName: 'CommentForm',
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.getDOMNode().value.trim();
		var msg = this.refs.msg.getDOMNode().value.trim();
		if (!author || !msg) {
			return;
		}
		this.props.onCommentSubmit({author: author, msg: msg});
		this.refs.author.getDOMNode().value = '';
		this.refs.msg.getDOMNode().value = '';
		return;
	},
	render: function() {
		return (
			React.createElement("div", {className: "comment-form", onSubmit: this.handleSubmit}, 
				React.createElement("form", null, 
					React.createElement("p", null, React.createElement("input", {type: "text", placeholder: "Your name...", ref: "author"})), 
					React.createElement("p", null, React.createElement("textarea", {placeholder: "Say something...", ref: "msg"})), 
					React.createElement("p", null, React.createElement("input", {type: "submit", value: "submit"}))
				)	
			)
		);
	}
});

var CommentBox = React.createClass({displayName: 'CommentBox',
	load: function() {
		$.ajax({
			url: "/list",
			dataType: "json",
			success: function(data) {
				if (data) {
					this.setState({data: data});
				}
			}.bind(this),
			error: function(data) {
				console.log(data);
			}
		});
	},
	handleCommentSubmit: function(comment) {
		$.ajax({
			url: "/save",
			type: "post",
			dataType: "json",
			data: comment,
			success: function(data) {
				if (data) {
					var comments = this.state.data;
					var newComments = comments.concat([data[0]]);	
					this.setState({data: newComments});
				}
			}.bind(this),
			error: function(data) {
				console.log(data);
			}
		});
	},
	getInitialState: function() {
		return {
			data: [
				{author: "Jack", msg: "Hello, Rose!"},
				{author: "Rose", msg: "Hello, Jack!"}
			]
		};
	},
	componentDidMount: function() {
		this.load();
		// setInterval(this.load, 10000);
	},
	render: function() {
		return (
			React.createElement("div", {className: "comment-box"}, 
				React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit}), 
				React.createElement(CommentList, {data: this.state.data})
			)
		);
	}
});

React.render(
  React.createElement(CommentBox, {data: data}),
  document.getElementById("commentWrap")
);