//https://loup-vaillant.fr/tutorials/earley-parsing/

function EARLEY_PARSE(words, grammar) {
	//init
	const S = {}
	for (let i=0; i<= words.length+1; ++i) S[i] = [
		/* EMPTY_ORDERED_SET state: {rules, index, j} */
	]

  /* ADD_TO_SET((γ → •S, 0), S[0]) */
	for (let k=0; k<words.length; ++k) {
    for (state in S[k]) { /* S[k] can expand during this loop */
      if (state.finished) COMPLETER(state, k)
      else if (state.next.isNonTerminal) PREDICTOR(state, k, grammar)         // non_terminal
      else SCANNER(state, k, words)             // terminal

		}
	}
  return chart
}

function PREDICTOR({rules, index, j}, k, grammar) {
	    for each (B → γ) in GRAMMAR_RULES_FOR(B, grammar) do
        ADD_TO_SET((B → •γ, k), S[k])
}
/*
function predict(set, sym) {
		var rules = set.grammar.rules[sym];
		if(rules) for(var i=0; i<rules.length; ++i) {
			var item = add_item(rules[i].advance, set, set, rules[i]);
			if(!item.tag.production) {
				var empty = add_item('', set, set);
				add_derivation(item, undefined, empty, item.rule);
			}
		}
		return set;
	}
=================
    State.prototype.predictor = function(grammar, chart) {
        var nonTerm = this.rhs[this.dot];
        var rhss = grammar.getRightHandSides(nonTerm);
        var changed = false; // This is needed for handling of epsilon (empty) productions
        for (var i in rhss) {
            var rhs = rhss[i];

            // This is needed for handling of epsilon (empty) productions
            // Just skipping over epsilon productions in right hand side
            // However, this approach might lead to the smaller amount of parsing tree variants
            var dotPos = 0;
            while(rhs && (dotPos < rhs.length) && (grammar.isEpsilonProduction(rhs[dotPos]))) {
            	dotPos++;
            }

            var newState = new State(nonTerm, rhs, dotPos, this.right, this.right);
            changed |= chart.addToChart(newState, this.right);
        }
        return changed;
    }
	====================
	
*/

function SCANNER({rules, index, j}, k, words) {
    if j < LENGTH(words) and a ⊂ PARTS_OF_SPEECH(words[k]) then
        ADD_TO_SET((A → αa•β, j), S[k+1])
}

function COMPLETER({rules, index, x}, k) {
    for each (A → α•Bβ, j) in S[x] do
        ADD_TO_SET((A → αB•β, j), S[k])
}
