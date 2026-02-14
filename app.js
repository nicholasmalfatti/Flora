// FloraMaster sync fix: WDQS query MUST include PREFIXes.
// Some networks also block WDQS; the UI shows details to help debug.

function $(id){ return document.getElementById(id); }

function toggleDetails(){
  const d = $("details");
  d.style.display = (d.style.display === "none") ? "" : "none";
}

async function sync(){
  const btn = $("syncBtn");
  btn.disabled = true;
  $("status").textContent = "Scaricando da Wikidata…";

  // SPARQL with PREFIX declarations (required)
  const sparql = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>
SELECT ?taxon ?taxonLabel ?sciName WHERE {
  ?taxon wdt:P105 wd:Q7432 .        # rank: species
  ?taxon wdt:P171* wd:Q756 .        # descendant of Plantae
  OPTIONAL { ?taxon wdt:P225 ?sciName . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
  FILTER(LANG(?taxonLabel)="it")
}
LIMIT 500
`;

  const url = "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(sparql);
  $("lastUrl").value = url;
  $("lastErr").textContent = "";

  try{
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/sparql-results+json"
      }
    });

    if(!res.ok){
      const txt = await res.text().catch(()=>"(no body)");
      throw new Error("HTTP " + res.status + " " + res.statusText + "\n\n" + txt.slice(0, 1200));
    }

    const json = await res.json();
    const rows = json?.results?.bindings || [];

    const plants = rows.map(r => ({
      it: r.taxonLabel?.value || "",
      sci: r.sciName?.value || r.taxonLabel?.value || ""
    })).filter(p => p.it);

    localStorage.setItem("floraDB", JSON.stringify({savedAt: Date.now(), count: plants.length, plants}));

    $("status").textContent = `✅ Sync completato: ${plants.length} piante salvate sul telefono.`;
  }catch(e){
    $("status").textContent = "❌ Errore sync. Premi “Mostra dettagli” e copia l’errore qui in chat.";
    $("lastErr").textContent = String(e);
  }finally{
    btn.disabled = false;
  }
}
