
#s_scss
#scss

#telegram 

# /* Page Styles */
<!-- basicblock-start oid="ObsFYTgCFJux3dFCUgl3Wk3J"  deck='s_scss' -->
/* Page Styles */::

page {

  /* everywhere else */
  * {
    font-family: Arial, Helvetica, sans-serif;
  }

  h1 {
    color: #369;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 250%;
  }

  h2, h3 {
    color: #444;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: lighter;
  }

  input[type="text"], button {
    color: #333;
    font-family: Cambria, Georgia, serif;
  }

  /* HeroesComponent's private CSS styles */
  .heroes {
    margin: 0 0 2em 0;
    list-style-type: none;
    padding: 0;
    width: 15em;

    li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0;
      height: 1.6em;
      border-radius: 4px;

      &:hover {
        color: #2c3a41;
        background-color: #e6e6e6;
        left: .1em;
      }

      &.selected {
        background-color: black;
        color: white;

        &:hover {
          background-color: #505050;
          color: white;
        }

        &:active {
          background-color: black;
          color: white;
        }
      }
    }

    .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #405061;
      line-height: 1em;
      position: relative;
      left: -1px;
      top: -0.34em;
      height: 1.67em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
    }

  }

  input {
    padding: .5rem;
  }
}
<!-- basicblock-end -->



