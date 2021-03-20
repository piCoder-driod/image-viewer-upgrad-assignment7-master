import React, { Component } from "react";
import Header from "../../common/header/Header";
import "./Home.css";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

const useStyles = (theme) => ({
    media: {
        height: 150,
        paddingTop: "56.25%", // 16:9,
    },
});

class Home extends Component {
    constructor() {
        super();
        this.state = {
            profilePic:
                "https://instagram.fblr1-3.fna.fbcdn.net/v/t51.2885-19/s320x320/145135244_432529917944662_4618383355731614603_n.jpg?tp=1&_nc_ht=instagram.fblr1-3.fna.fbcdn.net&_nc_ohc=gwvhBj0cQ1UAX9g_7sP&oh=706ee3d41b8fdd74c3fe2ecefc22afe1&oe=60701196",
            endpoint1: [],
            postListForSearch: [],
            postList: [],
            likeIcon: "dispBlock",
            likedIcon: "dispNone",
            comment: "",
            commentArea: "dispNone",
        };
    }

    componentDidMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        let accessToken = window.sessionStorage.getItem("access-token");
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    endpoint1: JSON.parse(this.responseText).data,
                });
                that.state.endpoint1.map((info) => {
                    return that.getImages(info);
                });
            }
        });

        // https://graph.instagram.com/me/media?fields=id,caption&access_token=YourAccessToken

        xhr.open(
            "GET",
            this.props.baseUrl +
            "me/media?fields=id,caption&access_token=" +
            accessToken
        );
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }

    getImages(info) {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        let accessToken = window.sessionStorage.getItem("access-token");
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let parsedData = JSON.parse(this.responseText);
                let newStateArray;
                let post = {};
                post.id = parsedData.id;
                post.caption = info.caption || "This is default caption";
                post.media_url = parsedData.media_url;
                post.profilePic = that.state.profilePic;
                post.username = parsedData.username;
                post.likeIcon = "dispBlock";
                post.likedIcon = "dispNone";
                post.likes = {};
                post.likes.count = 5;
                post.postComments = "dispNone";
                post.commentArea = "";
                post.clear = "";
                post.tags = `#tag1 #tag2`;
                post.commentContent = [];
                post.timestamp = new Date(parsedData.timestamp);
                newStateArray = that.state.postList.slice();
                newStateArray.push(post);
                that.setState({ postList: newStateArray });
                that.setState({ postListForSearch: newStateArray });
            }
        });

        //graph.instagram.com/17895695668004550?fields=id,media_type,media_url,username,timestamp&access_token=YourAccessToken
        xhr.open(
            "GET",
            this.props.baseUrl +
            info.id +
            "?fields=id,media_type,media_url,username,timestamp&access_token=" +
            accessToken
        );
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }

    myCallback = (filteredPost) => {
        this.setState({ postList: filteredPost });
    };

    //function to add a like to a post
    likeClickHandler = (id) => {
        let postList = this.state.postList;
        postList.forEach(function (post) {
            // if the post id equal to the liked post id then display
            // the likedIcon, hide the likeIcon, and increment like count by 1
            if (post.id === id) {
                post.likes.count += 1;
                post.likeIcon = "dispNone";
                post.likedIcon = "dispBlock";
                this.setState({
                    likeIcon: "dispNone",
                    likedIcon: "dispBlock",
                });
            }
        }, this);
    };

    //function to unlike a post
    likedClickHandler = (id) => {
        let postList = this.state.postList;
        postList.forEach(function (post) {
            // if the post id equal to the liked post id then display the likeIcon, hide the likedIcon, and decrement like count by 1
            if (post.id === id) {
                post.likes.count -= 1;
                post.likeIcon = "dispBlock";
                post.likedIcon = "dispNone";
                this.setState({
                    likeIcon: "dispBlock",
                    likedIcon: "dispNone",
                });
            }
        }, this);
    };

    commentChangeHandler = (e, id) => {
        this.setState({ comment: e.target.value });
        let postList = this.state.postList;
        postList.forEach(function (post) {
            if (post.id === id) {
                post.clear = e.target.value;
            }
        }, this);
    };

    addCommentHandler = (id) => {
        if (this.state.comment === "") {
            alert("Cannot add Empty comment");
        } else {
            let postList = this.state.postList;
            postList.forEach(function (post) {
                //if the post id is equal to the commented post id, then add the comment in the commentContent array
                if (post.id === id) {
                    post.commentContent.push(this.state.comment);
                    this.setState({ comment: "" });
                    post.clear = "";
                }
            }, this);
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                {/* display the contents only if the user is logged in */}
                {sessionStorage.getItem("access-token") !== null ? (
                    <div>
                        <Header
                            home="true"
                            profilePic={this.state.profilePic}
                            baseUrl={this.props.baseUrl}
                            list={this.state.postListForSearch}
                            callbackFromHome={this.myCallback}
                            history={this.props.history}
                        />
                        <div className="container">
                            {this.state.postList.map((post) => (
                                <Card className="cards-layout" key={"post" + post.id}>
                                    <div className="posts">
                                        <CardHeader
                                            avatar={<Avatar src={post.profilePic} alt="pic" />}
                                            title={post.username}
                                            // subheader="03/10/2018 16:07:24"
                                            subheader={
                                                post.timestamp.getMonth() +
                                                1 +
                                                "/" +
                                                post.timestamp.getDate() +
                                                "/" +
                                                post.timestamp.getFullYear() +
                                                " " +
                                                post.timestamp.getHours() +
                                                ":" +
                                                post.timestamp.getMinutes() +
                                                ":" +
                                                post.timestamp.getSeconds()
                                            }
                                        />
                                        <CardContent>
                                            <CardMedia
                                                className={classes.media}
                                                image={post.media_url}
                                            />
                                            <Typography variant="body2" color="inherit" component="p">
                                                {post.caption}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                style={{ color: "blue" }}
                                                display="inline"
                                            >
                                                {post.tags}
                                            </Typography>
                                            <CardActions disableSpacing>
                                                <div className="likes">
                                                    <div
                                                        className={post.likeIcon}
                                                        onClick={() => this.likeClickHandler(post.id)}
                                                    >
                                                        <FavoriteBorderIcon />
                                                    </div>
                                                    <div className={post.likedIcon}>
                                                        <FavoriteIcon
                                                            style={{ color: "red" }}
                                                            onClick={() => this.likedClickHandler(post.id)}
                                                        />
                                                    </div>
                                                    <span style={{ marginLeft: 10, marginBottom: 8 }}>
                            {post.likes.count < 2 ? (
                                <div> {post.likes.count} like </div>
                            ) : (
                                <div> {post.likes.count} likes </div>
                            )}
                          </span>
                                                </div>
                                            </CardActions>
                                            <div className="comments-section">
                                                {post.commentContent.map((value, key) => (
                                                    <CardActions>
                                                        <div key={"comment" + key}>
                                                            <Typography
                                                                variant="body2"
                                                                color="inherit"
                                                                component="span"
                                                                style={{ fontWeight: "bold" }}
                                                            >
                                                                {post.username}:{" "}
                                                            </Typography>
                                                            {value}
                                                        </div>
                                                    </CardActions>
                                                ))}
                                            </div>
                                            <br />
                                            <div className="comments">
                                                <FormControl className="control">
                                                    <InputLabel htmlFor="comment">
                                                        Add a comment
                                                    </InputLabel>
                                                    <Input
                                                        comment={this.state.comment}
                                                        onChange={(e) =>
                                                            this.commentChangeHandler(e, post.id)
                                                        }
                                                        value={post.clear}
                                                    />
                                                </FormControl>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginLeft: 20 }}
                                                    onClick={() => this.addCommentHandler(post.id)}
                                                >
                                                    ADD
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    this.props.history.push("/")
                )}
            </div>
        );
    }
}

export default withStyles(useStyles)(Home);