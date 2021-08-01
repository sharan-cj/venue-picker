import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { Input, Alerts } from "../Components";
import { Link, useHistory } from "react-router-dom";
import { signup } from "../services";

export const Signup = () => {
  const [message, setMessage] = useState("");
  const history = useHistory();
  return (
    <section
      className="vh-100 d-flex align-items-center"
      style={{ backgroundColor: "#508bfc" }}
    >
      <Alerts message={message} />
      <Container
        className="bg-white p-4 mx-auto container-sm rounded shadow-sm "
        fluid
        style={{ maxWidth: "500px" }}
      >
        <Formik
          initialValues={{ email: "", password: "", name: "" }}
          onSubmit={async (data) => {
            try {
              const response = await signup(data);
              localStorage.setItem("user", JSON.stringify(response.data.user));
              history.push("/");
            } catch (error) {
              console.log(error.response);
              setMessage(error.response.data.error ?? error.message);
            }
          }}
        >
          {() => (
            <Form>
              <div className="fs-4 mb-4">Signup</div>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                as={Input}
                autoFocus
                required
              />
              <Field
                type="email"
                className="my-3"
                name="email"
                placeholder="Email"
                as={Input}
                required
              />
              <Field
                type="password"
                name="password"
                placeholder="Password"
                as={Input}
                required
              />
              <div className="d-flex justify-content-between align-items-center mt-5">
                <Link to="/login">Login</Link>
                <Button variant="primary" type="submit" className=" px-4 ">
                  Signup
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </section>
  );
};
