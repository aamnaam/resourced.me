import React from "react";

const HomepageIntro = () => {
	return (
		<div className="text">
			<h5>Welcome to resourced.me!</h5>
			<div className="space"></div>
			<p>Sign in below to begin your resource-list sharing journey.</p>
			<div className="space2"></div>
			<hr />
			<p className="sampleText">
				Resourced.me makes it easier for students around the world to
				share their resource-lists with each other, hassle-free. Once
				you create your account, you will be able to begin creating and
				sharing your very own resource-lists for free.
			</p>
			<ul className="introBullets">
				<li>Manage all of your resource lists in one place</li>
				<li>Easily share your lists with your classmates</li>
				<li>
					Find resource lists for any modules, courses and
					universities
				</li>
				<li>Prepare yourself for your studies well in advance</li>
			</ul>
		</div>
	);
};

export default HomepageIntro;
