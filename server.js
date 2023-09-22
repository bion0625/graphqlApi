import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"first one!",
        userId:"1",
    },
    {
        id:"2",
        text:"second one!",
        userId:"2",
    }
]

let users = [
    {
        id:"1",
        firstName:"euijung",
        lastName:"lee"
    },
    {
        id:"2",
        firstName:"Elon",
        lastName:"Mask"
    }
]

const typeDefs = gql`
    type User{
        id:ID!
        firstName:String!
        lastName:String!
        fullName:String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        DeleteTweet(tweetId: ID!): Boolean!
    }
`;

const resolvers = {
    Query : {
        allUsers(){
            return users;
        },
        allTweets(){
            return tweets;
        },
        tweet(root, {id}){
            return tweets.find(tweet => tweet.id === id);
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            }
            tweets.push(newTweet);
            return newTweet;
        },
        DeleteTweet(_, { tweetId }) {
            const tweet = tweets.find(tweet => tweet.id === tweetId);
            if(!tweet)return false;
            tweets = tweets.filter(tweet => tweet.id !== tweetId);
            return true;
        }
    },
    User: {
        firstName({firstName}){
            return firstName;
        },
        fullName({firstName, lastName}){
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author({userId}){
            return users.find(user => user.id === userId);
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`running on ${url}`)
});