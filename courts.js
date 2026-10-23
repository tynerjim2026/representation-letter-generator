
/* Representation Letter Generator
   Capital Region Court Directory

   Each court record contains:
   - county
   - court name
   - verified mailing address

   Only add addresses confirmed from official court sources.
*/

const COURT_DIRECTORY = {
  "Albany": [],
  "Schenectady": [],
  "Saratoga": [],
  "Rensselaer": [],
  "Montgomery": []
};

// Example of the format for a verified court:
// {
//   name: "Court Name",
//   address: "Street or PO Box\nCity, NY ZIP"
// }
