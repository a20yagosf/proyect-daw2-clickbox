# controldeck.js
## Control HTML5 Presentations with node.js

Created by [John Polacek](http://twitter.com/johnpolacek)

### Getting Started
First, [download the source](https://github.com/dfcb/controldeck.js/archive/master.zip). Open up a terminal window, install the dependencies, and run the app.

```bash
$ npm install
$ node app
```

Go to [http://localhost:8080](http://localhost:8080) to view the demo page.

Choose one of the demos and open the slides and controller links in separate windows. Push the buttons in the controller window to control the slides.

### Make Your Own
Create your own slide deck using one of the presentation frameworks. Embed the socket.io and controldeck-slide.js scripts at the bottom of the page, before the `</body>` tag.

```html
<!-- controldeck.js -->
<script src="/socket.io/socket.io.js"></script>
<script src="/controldeck-slides.js"></script>
```

Use the 2 button controller or create your own. Refer to the examples for how to do it. The code is  straightforward. The controller pages simply use Node.js and socket.io to pass along commands to the slides page.

* * *

### Draftfcb Chicago
We are the development group at Draftfcb Chicago. If you want to work on big digital ideas for big brands, get in touch with us at [devrecruiting@draftfcb.com](mailto:devrecruiting@draftfcb.com).

* * *

The MIT License (MIT)
Copyright © 2013 John Polacek

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
