/**
 * Configuration for amplify 
 * - should be imported to pages that uses amplify
 * - for ease import it to _app.js
 */
import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config)