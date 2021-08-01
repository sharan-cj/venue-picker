import axios from "axios";
const client_id = process.env.REACT_APP_FS_CLIENT_ID;
const client_secret = process.env.REACT_APP_FS_CLIENT_SECRET;

export const fetchVenue = ({ query, near }) => {
  return axios.get(`https://api.foursquare.com/v2/venues/search`, {
    params: {
      client_id,
      client_secret,
      near,
      query,
    },
  });
};

// auth

export const signup = (body) => axios.post("/api/auth/signup", body);
export const signin = (body) => axios.post("/api/auth/signin", body);

// users

export const fetchUsers = () => axios.get("/api/users");

//board, venues, votes

export const updateBoard = (body) => axios.put("/api/board", body);
export const getBoard = (body) => axios.get("/api/board");
