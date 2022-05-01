import React from "react";
import { useEffect } from "react";
import smile from "../images/smile.png";
import "./stylesheet.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const PrivacyPolicy = () => {
	useEffect(() => {
		document.title = "Privacy Policy • resourced.me";
	}, []);

	return (
		<div className="privacyPolicy">
			<div className="headerPrivacyPolicy">
			<Link to="/" className="BLOO">
				<div className="logoCreateList">
					<img src={smile} alt="Logo" className="logoImage" />
					<h1 className="logoText">resourced.me</h1>
				</div>
			</Link>
				<div className="buttonDLCreateList">
					<Link to="/">
						<Button id="return-home" variant="dark" size="lg">
							Return Home
						</Button>{" "}
					</Link>
				</div>
			</div>
			<hr />
			<div className="privPolText">
				<p>
					This privacy policy will explain how our organization
					“resourced.me” uses the personal data we collect from you
					when you use our website.
				</p>
				<br />
				<ul className="noBullets">
					<h5>Table of contents</h5>
					<li><a href="#1">1. What data do we collect?</a></li>
					<li><a href="#2">2. How do we collect your data?</a></li>
					<li><a href="#3">3. How will we use your data?</a></li>
					<li><a href="#4">4. How do we store your data?</a></li>
					<li><a href="#5">5. How long do we store your data?</a></li>
					<li><a href="#6">6. What are your data protection rights?</a></li>
					<li><a href="#7">7. What are cookies?</a></li> 
					<li><a href="#8">8. How do we use cookies?</a></li> 
					<li><a href="#9">9. What types of cookies do we use?</a></li> 
					<li><a href="#10">10. How to manage your cookies</a></li> 
					<li><a href="#11">11. Privacy policies of other websites</a></li> 
					<li><a href="#12">12. Changes to our privacy policy</a></li> 
					<li><a href="#13">13. How to contact us</a></li>
					<li><a href="#14">14. How to contact the appropriate authorities</a></li>
				</ul>
				<br />
				<a id="1"><b>1. What data do we collect?</b></a>
				<p>Resourced.me collects the following data:</p>
				<ul>
					<li>
						Personal identification information (name, email
						address) through your Google Account
					</li>
					<li>A username that you set when you first sign in</li>
					<li>
						Resource-list contents (module titles, university names,
						course names, descriptions, resource titles, resource
						URLs and resource descriptions)
					</li>
				</ul>
				<p>Data that we may receive about you from others:</p>
				<ul>
					<li>
						If you decide to register for an account (or access your
						account) through authentication via Google OAuth 2.0, we
						may collect personal identification information (name,
						email address) from Google, consistent with your privacy
						settings in your Google account.{" "}
					</li>
				</ul>
				<br />
				<a id="2"><b>2. How do we collect your data?</b></a>
				<p>
					You directly provide resourced.me with most of the data we
					collect. We collect data and process data when you:{" "}
				</p>
				<ul>
					<li>
						Log in to our website through an authentication service
						(such as Google Accounts as a Single Sign On)
					</li>
					<li>
						Submit a resource-list that you created on our website
					</li>
					<li>Use or view our website via your browser’s cookies.</li>
				</ul>
				<p>
					Resourced.me may also receive your data indirectly from the
					following sources for the purposes described above:
				</p>
				<ul>
					<li>Google LLC</li>
				</ul>
				<br />
				<a id="3"><b>3. How will we use your data?</b></a>
				<p>Resourced.me collects your data so that we can:</p>
				<ul>
					<li>Manage your account</li>
					<li>Attribute your created lists to your account</li>
				</ul>
				<br />
				<a id="4"><b>4. How do we store your data?</b></a>
				<p>
					Resourced.me securely stores your data through MongoDB
					Atlas. We do not store your data on our own database or
					servers. All security is handled by MongoDB Atlas. For more
					information, visit <a href="https://www.mongodb.com/cloud/atlas/security" target="_blank">https://www.mongodb.com/cloud/atlas/security</a>.
				</p>
				<br />
				<a id="5"><b>5. How long do we store your data?</b></a>
				<p>
					Resourced.me will retain your data for one year after your last
				 	login, or until you close your account with us. Once your
				  	account is closed, we will delete all information associated
				   	with your account from our database. This includes your
				    resource lists and Google information. {" "}
				</p>
				<br />
				<a id="6"><b>6. What are your data protection rights?</b></a>
				<p>
					Resourced.me would like to make sure that you are fully
					aware of all your data protection rights. Every user is
					entitled to the following:{" "}
				</p>
				<ul>
					<li>
						The right to access – You have the right to request
						resourced.me for copies of your personal data. We may
						charge you a small fee for this service.{" "}
					</li>
					<li>
						The right to rectification – You have the right to
						request that resourced.me correct any information you
						believe is inaccurate. You also have the right to
						request resourced.me to complete the information you
						believe is incomplete.{" "}
					</li>
					<li>
						The right to erasure – You have the right to request
						that resourced.me erase your personal data, under
						certain conditions.{" "}
					</li>
					<li>
						The right to restrict processing – You have the right to
						request that resourced.me restrict the processing of
						your personal data, under certain conditions.{" "}
					</li>
					<li>
						The right to object to processing – You have the right
						to object to resourced.me’s processing of your personal
						data, under certain conditions.
					</li>
					<li>
						The right to data portability – You have the right to
						request that resourced.me transfer the data that we have
						collected to another organization, or directly to you,
						under certain conditions.
					</li>
				</ul>
				<p>If you make a request, we have one month to respond to you. 
						If you would like to exercise any of these rights, please
						 contact us at our email: <a href="mailto:support@resourced.me">support@resourced.me</a></p>
				<br />
				<a id="7"><b>7. What are cookies?</b></a>
				<p>
					Cookies are text files placed on your computer to collect
					standard Internet log information and visitor behavior
					information. When you visit our websites, we may collect
					information from you automatically through cookies or
					similar technology.
				</p>
				<p>For further information, visit <a href="https://www.allaboutcookies.org" target="_blank">allaboutcookies.org</a>.</p>
				<br />
				<a id="8"><b>8. How do we use cookies?</b></a>
				<p>
					{" "}
					Resourced.me uses cookies in a range of ways to improve your
					experience on our website, including:{" "}
				</p>
				<ul>
					<li>Keeping you signed in </li>
				</ul>
				<br />
				<a id="9"><b>9. What types of cookies do we use?</b></a>
				<p>
					There are a number of different types of cookies, however,
					our website uses:{" "}
				</p>
				<ul>
					<li>
						Functionality – resourced.me uses these cookies so that
						we recognize you on our website and remember your
						previously selected preferences to keep you signed in.
						Only first-party cookies are used.{" "}
					</li>
				</ul>
				<br />
				<a id="10"><b>10. How to manage cookies</b></a>
					<p>
						You can set your browser not to accept cookies, and the
						above website tells you how to remove cookies from your
						browser. However, in a few cases, some of our website
						features may not function as a result.{" "}
					</p>
				<br />
				<a id="11"><b>11. Privacy policies of other websites</b></a>
				<p>
					The resourced.me website contains links to other websites.
					Our privacy policy applies only to our website, so if you
					click on a link to another website, you should read their
					privacy policy.{" "}
				</p>
				<br />
				<a id="12"><b>12. Changes to our privacy policy</b></a>
				<p>
					Resourced.me keeps its privacy policy under regular review
					and places any updates on this web page. This privacy policy
					was last updated on 24 March 2022.{" "}
				</p>
				<br />
				<a id="13"><b>13. How to contact us</b></a>
				<p>
					If you have any questions about resourced.me’s privacy
					policy, the data we hold on you, or you would like to
					exercise one of your data protection rights, please do not
					hesitate to contact us.
				</p>
				<p>Email us at: <a href="mailto:support@resourced.me"> support@resourced.me </a></p>
				<br />
				<a id="14"><b>14. How to contact the appropriate authority</b></a>
				<p>
					Should you wish to report a complaint or if you feel that
					resourced.me has not addressed your concern in a
					satisfactory manner, you may contact the Information
					Commissioner’s Office.{" "}
				</p>
				<p>Email: <a href="mailto:icocasework@ico.org.uk"> icocasework@ico.org.uk </a></p>
				<p>Phone: 0303 123 1113 </p>
				<p>Address: Wycliffe House, Water Ln, Wilmslow SK9 5AF </p>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
