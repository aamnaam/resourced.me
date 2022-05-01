import React from "react";

const Resource = ({ resourceData }) => {
  const { url, description } = resourceData;
  return (
    <div>
      <hr className="line"></hr>
      <a href={url} target="_blank">{url.substring(0, 60)}{url.length > 60 ? "..." : ""}</a> <br />
      <p className="resourceDesc">{description}</p>
    </div>
  );
};

export default Resource;
