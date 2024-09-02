DROP DATABASE IF EXISTS tweeter_db;
CREATE DATABASE tweeter_db;

USE tweeter_db;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(45) NOT NULL,
    profile_picture_path VARCHAR(50) NOT NULL DEFAULT ("default.png"),
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    followers INT NOT NULL DEFAULT(0),
    following INT NOT NULL DEFAULT(0),
    notifications INT NOT NULL DEFAULT(0)
);

CREATE TABLE follows (
    follower_id INT,
    followee_id INT,
    PRIMARY KEY (follower_id , followee_id),
    FOREIGN KEY (follower_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (followee_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
);

CREATE TABLE tweets (
    tweet_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text VARCHAR(200) NOT NULL,
    images INT NOT NULL,
    likes INT NOT NULL,
    replies INT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
);

CREATE TABLE likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    tweet_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (tweet_id)
        REFERENCES tweets (tweet_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
);

CREATE TABLE images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    tweet_id INT NOT NULL,
    filepath VARCHAR(45) NOT NULL,
    FOREIGN KEY (tweet_id)
        REFERENCES tweets (tweet_id)
        ON DELETE CASCADE
);

CREATE TABLE replies (
    reply_tweet_id INT NOT NULL,
    original_tweet_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (reply_tweet_id , original_tweet_id),
    FOREIGN KEY (reply_tweet_id)
        REFERENCES tweets (tweet_id)
        ON DELETE CASCADE,
    FOREIGN KEY (original_tweet_id)
        REFERENCES tweets (tweet_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
); 

CREATE TABLE notifications (
	notification_id INT NOT NULL,
    user_id INT NOT NULL,
    text VARCHAR(200) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(notification_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);