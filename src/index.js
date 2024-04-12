import { load } from "./handler"

if (localStorage.getItem('location')) {
    load(localStorage.getItem('location'))  
} else {
    load('London')
}
