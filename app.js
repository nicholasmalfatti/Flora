async function sync(){
document.getElementById("status").textContent="Scaricando...";
try{
let r=await fetch("https://query.wikidata.org/sparql?format=json&query=SELECT%20?item%20?itemLabel%20WHERE%20{?item%20wdt:P171*%20wd:Q756.%20SERVICE%20wikibase:label%20{bd:serviceParam%20wikibase:language%20%22it%22.}}%20LIMIT%20500");
let j=await r.json();
localStorage.setItem("floraDB",JSON.stringify(j.results.bindings));
document.getElementById("status").textContent="Sync completato 👍";
}catch(e){
document.getElementById("status").textContent="Errore sync";
}
}
