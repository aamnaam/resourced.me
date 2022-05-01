import React from "react";
import Resource from "./Resource";

const Section = ({ sectionData }) => {
  const { title, resources } = sectionData;
  return (
    <div className="section">
      {/* <strong>Resource Title: </strong> {title} <br /> */}
      <b>{title}</b> <br />
      <div>
        {/* <b>URL: </b> */}
        {resources.map((resource) => (
          <Resource key={resource.url} resourceData={resource} />
        ))}
      </div>
    </div>
  );
};

export default Section;
