import React from "react";
import Header from "./Header.js";
import "../styles/Welcome.css";
import "../styles/Background.css"
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <>
      <Header />
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column justify-content-center align-items-center">
        <main role="main" className="inner cover text-center">
          <h1 className="cover-heading">Bookstagram</h1>
          <p className="lead">
           Bookstagram is your personalized Book Collection and Social Media that you can search for books,
           share with your friends. Like a letterboxd for books and meet other people
          </p>
          <p className="lead">
          <Link to="/about" className="btn btn-lg btn-secondary">About Us</Link>

          </p>
        </main>

        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>
              Made by Nguyen Cat
              <a href="https://www.linkedin.com/in/nguyen-cat-huynh-548755219/"> My LinkedIn</a>.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Welcome;
