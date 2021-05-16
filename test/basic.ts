interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

import * as vue from 'vue'
console.log(vue);

let user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user); 
// a+(