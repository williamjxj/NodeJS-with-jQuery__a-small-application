There are 3 dirs and 1 new file in '~/lib':
1. Schemas: All Schemas are defined here, which can be re-use by different story. e.g., UserSchema can be used by 'connect Facebook' and 'update Peoplemelt Account'.

2. Models: All Mongoose Collections operation methods are defined here. e.g:
 2.a) for 'connect Facebook', all the implement methods are exports from Models/connectFacebook.js
 2.b) for 'update Profile', all the implement methods are exports from Models/updateProfile.js

3. Resources: All HTTP request/response are defined here, which are extracted from server.js.
   This is a application of 'express-resource' => https://github.com/visionmedia/express-resource
<pre><code>
   GET  /           -> index
   GET  /new        -> new
   POST /           -> create
   GET  /:id        -> show
   GET  /:id/edit   -> edit
   PUT  /:id        -> update
   DELETE /:id      -> destroy
</code></pre>

4. lib/common.js
Which includes all common functions used by different models. e.g.: get_current_datetime
