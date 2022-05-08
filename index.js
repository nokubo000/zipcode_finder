/**
 * This is the JS to implement the UI for Zip Code Locator.
 * Uses the Zippopotam API to get information about the location/zipcode for
 * the zipcode/area the user has entered.
 */

"use strict";

(function() {

  const BASE_URL = "http://api.zippopotam.us/us/";

  window.addEventListener("load", init);

  /**
   * This starts running when the page initially loads.
   * Allowing the user to input a zip code in the U.S. to get the
   * corresponding location's information
   */
  function init() {
    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      makeRequest();
    });
  }

  /**
   * Requests the information for zip code entered by the user in the
   * Zippopotam API and processes the data returned. If there is an
   * error during this process, the handleError function is called.
   */
  function makeRequest() {
    let enteredZip = id("zip-code").value;
    if (parseInt(enteredZip)) {
      let url = BASE_URL + enteredZip;
      fetch(url)
        .then(statusCheck)
        .then(resp => resp.json())
        .then(processData)
        .catch(handleError);
    } else {
      handleError();
    }

  }

  /**
   * Uses the responseData to gather/organize information about the zip code's
   * location and then presents the found data to the user.
   * @param {object} responseData - Location data returned from the
   * Zippopotam API for the entered zip code, used to get location data
   * to display for the user.
   */
  function processData(responseData) {
    if (!id("error-report").classList.contains("hidden")) {
      id("error-report").classList.add("hidden");
    }
    let newSection = document.createElement("section");
    newSection.classList.add("found-info");
    let parent = id("enter-info");
    parent.appendChild(newSection);
    insertData(responseData, newSection);
  }

  /**
   * Adds the location data for the zip code from responseData into newSection
   * @param {object} responseData - Location data returned from the
   * Zippopotam API for the entered zip code, used to get location data
   * to display for the user.
   * @param {object} newSection - New DOM object containing the location information for
   * the entered zip code
   */
  function insertData(responseData, newSection) {
    let zipcode = document.createElement("p");
    let placeZipCode = responseData["post code"];
    zipcode.appendChild(document.createTextNode("Zip Code: " + placeZipCode));
    newSection.appendChild(zipcode);
    let place = responseData.places[0];
    getSpecificInfo("place name", "City", place, newSection);
    getSpecificInfo("state", "State", place, newSection);
    getSpecificInfo("latitude", "Latitude", place, newSection);
    getSpecificInfo("longitude", "Longitude", place, newSection);
  }

  /**
   * Informs the user that there was an error during the
   * process of trying to find their input's location information.
   */
  function handleError() {
    if (id("error-report").classList.contains("hidden")) {
      id("error-report").classList.remove("hidden");
    }
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Helper function to return the response's result text if successful,
   * otherwise returns the rejected Promise result with an error status
   * and corresponding text
   * @param {object} res - response to check for success/error
   * @returns {object} - valid response if response was successful,
   * otherwise rejected promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Gathers the specific information from the given place using the given jsonName that
   * it is refered by in place, then adds the information into the newSection
   * using the given textTitle to specify what the information represents to the user.
   * @param {string} jsonName - Name of the specific value wanted in the place array
   * @param {string} textTitle - Text displayed to the user that describes the information
   * being displayed
   * @param {array} place - array from the returned json object from the API that contains
   * information about the zip code's place.
   * @param {object} newSection - New DOM object containing the location information for
   * the entered zip code
   */
  function getSpecificInfo(jsonName, textTitle, place, newSection) {
    let newPTag = document.createElement("p");
    let placeName = place[jsonName];
    newPTag.appendChild(document.createTextNode(textTitle + ": " + placeName));
    newSection.appendChild(newPTag);
  }

})();