import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styled from "styled-components";
import { TiTickOutline } from "react-icons/ti";
import { fetchUsers, getBoard, updateBoard } from "../services";
import { useHistory } from "react-router-dom";
import { Alerts } from "../Components";

export const Home = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [friend, setFriend] = useState("");

  const history = useHistory();

  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data.users);
      } catch (error) {
        console.log(error.response.data.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBoard();
        setData(response.data.board);
      } catch (error) {
        console.log(error.response);
      }
    })();
  }, []);

  if (!user) history.push("/login");

  const participants = data?.participants ?? [];
  const venues = data?.venues ?? [];
  let votesCount = {};
  participants.forEach((p) => {
    const vid = p.vote;
    if (vid) {
      if (vid in votesCount) {
        votesCount[vid] += 1;
      } else {
        votesCount[vid] = 1;
      }
    }
  });

  const maxVotes = Math.max(...Object.values(votesCount));
  const mostVotedPlace = Object.keys(votesCount).find(
    (key) => votesCount[key] === maxVotes
  );

  const addPlace = async () => {
    try {
      const res = await updateBoard({
        venues: [...venues, { name: placeName }],
      });
      setData(res.data.board);
    } catch (error) {
      setMessage(error.response.data.error ?? error.message);
    }
  };

  const addParticipants = async () => {
    try {
      const selectedUser = users.find((u) => u.id === friend);
      const res = await updateBoard({
        participants: [
          ...participants,
          { name: selectedUser.name, userId: selectedUser.id, vote: "" },
        ],
      });
      setData(res.data.board);
    } catch (error) {
      setMessage(error.response.data.error ?? error.message);
    }
  };

  const updateVote = async (vote) => {
    try {
      console.log(vote);
      const newParticipantsArr = participants.map((p) => {
        if (p.userId === user.id) {
          return { name: user.name, userId: user.id, vote: vote };
        } else {
          return p;
        }
      });
      const res = await updateBoard({
        participants: newParticipantsArr,
      });
      setData(res.data.board);
    } catch (error) {
      setMessage(error.response.data.error ?? error.message);
    }
  };

  return (
    <>
      <Alerts message={message} />

      <nav className="navbar navbar-expand-lg navbar-light text-light position-fixed top-0 w-100 fw-normal bg-dark py-3 px-5">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="fs-3">Venue Picker</div>
          <a
            href="#"
            className="link-light"
            onClick={() => {
              history.push("/login");
              localStorage.removeItem("user");
            }}
          >
            Logout
          </a>
        </div>
      </nav>
      <div className="p-4 "></div>
      <div className="m-5 text-dark fs-4 fw-normal ">Hello, {user?.name}</div>
      <DualSection className="container-md">
        <Container
          className="bg-white p-4  mx-auto container-sm rounded shadow-sm"
          fluid
        >
          <Form style={{ maxWidth: "700px" }}>
            <Form.Label className="fs-5">Add a lunchplace</Form.Label>
            <Form.Control
              type="text"
              name="venue"
              onChange={(e) => setPlaceName(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="button"
                className="mt-4 px-4 "
                onClick={addPlace}
              >
                Add
              </Button>
            </div>
          </Form>
        </Container>
        <Container
          className="bg-white p-4 mx-auto container-sm rounded shadow-sm "
          fluid
        >
          <Form style={{ maxWidth: "700px" }}>
            <Form.Label className="fs-5">Add participant</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setFriend(e.target.value)}
            >
              <option value="" hidden>
                Select a friend
              </option>
              {users.map((user) => (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Control>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="button"
                className="mt-4 px-4 "
                onClick={addParticipants}
              >
                Add
              </Button>
            </div>
          </Form>
        </Container>
      </DualSection>
      <Container
        className="bg-white p-4 my-5 mx-auto container-sm rounded shadow-sm"
        fluid
      >
        <Table>
          <TabRow>
            <TabHead></TabHead>
            {venues.map((venue) => {
              return (
                <TabHead key={venue.id} className="text-center">
                  {venue.name}
                </TabHead>
              );
            })}
          </TabRow>
          {participants.map((user) => {
            return (
              <TabRow key={user.id}>
                <TabHead>{user.name}</TabHead>
                {venues.map((venue, i) => {
                  return (
                    <TabData
                      key={venue._id + i}
                      className="text-center fs-5 text-primary"
                      onClick={() => updateVote(venue._id)}
                      greenBg={mostVotedPlace === venue._id}
                    >
                      {venue._id === user.vote && <TiTickOutline />}
                    </TabData>
                  );
                })}
              </TabRow>
            );
          })}
        </Table>
      </Container>

      <div className="p-2"></div>
    </>
  );
};

const Table = styled.div`
  background-color: #fff;
  width: 100%;
  overflow: auto;
  font-weight: 400;
  color: #212529;
`;

const TabRow = styled.div`
  display: flex;
  align-items: stretch;
`;

const TabHead = styled.div`
  border: 1px solid #f9f9f9;
  padding: 1rem;
  background: #eaeaea;
  min-width: 120px;
  font-weight: 600;
`;

const TabData = styled.div`
  border: 1px solid #f9f9f9;
  padding: 1rem;
  min-width: 120px;
  color: #747474;
  background: ${(props) => (props.greenBg ? "#90ee90" : "#fff")};
`;

const TabColumn = styled.div``;

const DualSection = styled.div`
  display: grid;
  max-width: 1200px;
  margin: auto;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
