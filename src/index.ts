import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type Book {
    id: Int!
    title: String
    author: String
  }
  type Query {
    books: [Book]
    book(id:Int!): Book
  }
  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(id:Int!): Book
    updateBook(id:Int!,title: String!, author: String!): Book
  }
`;

let books = [
  {
    id: 1,
    title: "Rich Dad poor Dad",
    author: "Robert Kiyosaki",
  },
  {
    id: 2,
    title: "Art of negotiations",
    author: "Michael Wheeler",
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const resolvers = {
  Query: {
    //get all books
    books: () => books,
    //get single book
    book: (_: any, args: any) => {
      return books.find((book) => book.id === args.id);
    },
  },
  Mutation: {
    addBook: (_, { title, author }) => {
      let book = { id: books.length + 1, title, author };
      books.push(book);
      return book;
    },
    deleteBook: (_, { id }) => {
      let bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex >= 0) {
        let bookToBeDeleted = books[bookIndex];
        books = books.filter((book) => book.id !== id);
        return bookToBeDeleted;
      } else {
        return null;
      }
    },
    updateBook: (_, { id, title, author }) => {
      let bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex >= 0) {
        books[bookIndex] = {
          id,
          title,
          author,
        };
        return {
          id,
          title,
          author,
        };
      } else {
        return null;
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
