// PostCard.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PostCard = ({ post, onDelete, onNext, onPrev }) => {
  return (
    <div className="card position-relative" style={{ width: "18rem" }}>
      <div className="card-body text-center">
        <h5 className="card-title">{post.book_title}</h5>
        <p className="card-text">{post.content}</p>
        <button onClick={onDelete} className="btn btn-danger">
          Delete
        </button>
      </div>

      <FontAwesomeIcon
        icon={faArrowLeft}
        className="icon-arrow-left"
        onClick={onPrev}
      />
      <FontAwesomeIcon
        icon={faArrowRight}
        className="icon-arrow-right"
        onClick={onNext}
      />
    </div>
  );
};

export default PostCard;
