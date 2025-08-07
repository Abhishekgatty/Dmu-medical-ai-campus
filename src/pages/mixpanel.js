
import mixpanel from "mixpanel-browser";

mixpanel.init("2797448f849637794d1cfec707d689ed", {
  debug: true, // Set to false in production
   track_pageview: false,
});

export default mixpanel;
