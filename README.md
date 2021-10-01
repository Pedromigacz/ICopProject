<h1>Tradojo backend</h1>
<p>This is the first version of tradojo back_end server.</p>
<h2>Stack</h2>
<ul>
  <li><b>NodeJS</b> and <b>ExpressJs</b> to create a server</li>
  <li><b>Cloudinary</b> to host files (ex: pdfs, images, etc)</li>
  <li><b>JWT</b> based auth system, built from scratch (great for micro-services)</li>
  <li>A <b>MongoDB</b> database</li>
  <li><b>node-cron</b> manage our cron jobs</li>
  <li>As payment gateway, we user <b>Stripe</b> (to manage our subscriptions)</li>
  <li>Some utility packages like <b>axios</b>, <b>bcryptjs</b>, <b>cors</b>, <b>helmet</b>, <b>querystring</b></li>
  <li>We use <b>discord-oauth2</b> to let users bind their discord account to ours, and to join our clients server</li>
  <li><b>discordJS</b> is used to connect to our bot and handle our clients access.</li>
  <li><b>nodemailer</b> and <b>send grid</b> handle emails</li>
</ul>
<h2>License</h2>
<p>Use this code as you wish, but it would be nice if you ref me or this repo somewhere 🤠</p>
<h3>OBS: All the tokens and sensitive data on this app were from a test account and all of them are already revoked.</h3>
