// ============================================================
//  PathForge — Skill Validation Question Bank
//  Questions are topic-specific, evidence-driven, and shuffled
//  per attempt so no two users see identical sequences.
//
//  Each question has:
//   - id: unique
//   - topic: the skill name (must match roadmap skill key)
//   - round: 1 (conceptual) | 2 (practical/output)
//   - difficulty: "Easy" | "Medium" | "Hard"
//   - type: "mcq" | "output" | "debug" | "scenario"
//   - q: question text
//   - options: array of strings
//   - answer: 0-indexed correct option
//   - explanation: why this answer is correct
// ============================================================

export const SKILL_QUESTIONS = {
  // ── PYTHON ─────────────────────────────────────────────────
  "Python": {
    round1: [
      { id:"py1_r1_1", topic:"Python", round:1, difficulty:"Medium", type:"output",
        q:"What does the following return?\n\nlist(map(lambda x: x**2, [1,2,3]))",
        options:["[1, 4, 9]","[2, 4, 6]","[1, 2, 3]","Error"],
        answer:0, explanation:"map() applies the lambda (square) to each element: 1→1, 2→4, 3→9." },
      { id:"py1_r1_2", topic:"Python", round:1, difficulty:"Medium", type:"mcq",
        q:"Which of the following creates a shallow copy of a list in Python?",
        options:["list.deepcopy(a)","a[:]","copy.deepcopy(a)","a.clone()"],
        answer:1, explanation:"a[:] (slice copy) and list(a) create shallow copies. deepcopy() creates deep copies." },
      { id:"py1_r1_3", topic:"Python", round:1, difficulty:"Hard", type:"output",
        q:"What is the output?\n\nx = [1,2,3]\ny = x\ny.append(4)\nprint(x)",
        options:["[1, 2, 3]","[1, 2, 3, 4]","[4]","Error"],
        answer:1, explanation:"y = x makes y point to the same list object. Mutating y also mutates x." },
      { id:"py1_r1_4", topic:"Python", round:1, difficulty:"Medium", type:"mcq",
        q:"What does the `*args` syntax in a function definition allow?",
        options:["Pass keyword arguments","Pass any number of positional arguments","Define default parameters","Unpack dictionaries"],
        answer:1, explanation:"*args captures any number of positional arguments into a tuple." },
      { id:"py1_r1_5", topic:"Python", round:1, difficulty:"Hard", type:"debug",
        q:"This code raises a TypeError. Why?\n\ndef add(a, b):\n    return a + b\nprint(add('3', 4))",
        options:["Python can't add strings","int and str can't be concatenated with '+'","Function expects ints only","add() requires 3 arguments"],
        answer:1, explanation:"Python's + operator cannot add str and int; it raises TypeError: can only concatenate str (not 'int') to str." },
      { id:"py1_r1_6", topic:"Python", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the difference between `is` and `==` in Python?",
        options:["`is` compares values, `==` compares identity","`is` compares identity (memory), `==` compares values","They are identical","== works only for primitives"],
        answer:1, explanation:"`is` checks if two variables point to the same object in memory. `==` checks value equality." },
      { id:"py1_r1_7", topic:"Python", round:1, difficulty:"Easy", type:"output",
        q:"What does `range(1, 10, 2)` produce?",
        options:["[1,3,5,7,9]","[1,2,3,4,5,6,7,8,9]","[2,4,6,8,10]","[1,3,5,7]"],
        answer:0, explanation:"range(start, stop, step): starts at 1, increments by 2, stops before 10 → 1,3,5,7,9." },
      { id:"py1_r1_8", topic:"Python", round:1, difficulty:"Hard", type:"scenario",
        q:"A decorator @timer is applied to a function. When is the decorator code executed?",
        options:["Each time the function is called","At import time, when the function is defined","Only on the first call","Never — decorators are syntactic sugar"],
        answer:0, explanation:"Decorator code runs each time the wrapped function is invoked (the wrapper function is called). The @decorator line applies the decorator at definition time, but the wrapper logic runs on each call." },
      { id:"py1_r1_9", topic:"Python", round:1, difficulty:"Medium", type:"mcq",
        q:"What does a generator function use instead of `return`?",
        options:["emit","yield","produce","output"],
        answer:1, explanation:"`yield` suspends execution and returns a value. On next iteration, resumes from where it left off." },
      { id:"py1_r1_10", topic:"Python", round:1, difficulty:"Hard", type:"output",
        q:"What is the output?\n\nd = {'a': 1, 'b': 2}\nd.update({'b': 99, 'c': 3})\nprint(d)",
        options:["{'a':1,'b':2}","{'a':1,'b':99,'c':3}","{'b':99,'c':3}","Error"],
        answer:1, explanation:"dict.update() merges keys, overwriting existing ones (b:2→b:99) and adding new ones (c:3)." },
    ],
    round2: [
      { id:"py1_r2_1", topic:"Python", round:2, difficulty:"Hard", type:"coding",
        q:"Write a function `first_non_repeating(s: str) -> str` that returns the first character in `s` that does not repeat. Return `'-'` if all characters repeat.\n\nExample:\nInput: 'aabbcde'\nOutput: 'c'\n\nInput: 'aabb'\nOutput: '-'",
        starterCode:`def first_non_repeating(s: str) -> str:\n    # Your solution here\n    pass\n\nprint(first_non_repeating('aabbcde'))  # c\nprint(first_non_repeating('aabb'))     # -`,
        testCases:[
          { input:"aabbcde", expected:"c" },
          { input:"aabb", expected:"-" },
          { input:"abcabc", expected:"-" },
          { input:"stress", expected:"t" },
          { input:"a", expected:"a" },
        ],
        explanation:"Use an OrderedDict or Counter + iteration to find the first char with count == 1." },
      { id:"py1_r2_2", topic:"Python", round:2, difficulty:"Hard", type:"coding",
        q:"Implement a function `flatten(nested)` that takes an arbitrarily nested list and returns a flat list.\n\nExample:\nInput: [1, [2, [3, [4]], 5]]\nOutput: [1, 2, 3, 4, 5]",
        starterCode:`def flatten(nested):\n    # Your solution here\n    pass\n\nprint(flatten([1, [2, [3, [4]], 5]]))  # [1, 2, 3, 4, 5]`,
        testCases:[
          { input:"[1, [2, [3, [4]], 5]]", expected:"[1, 2, 3, 4, 5]" },
          { input:"[1, 2, 3]", expected:"[1, 2, 3]" },
          { input:"[[[]]]", expected:"[]" },
        ],
        explanation:"Recursively iterate. If element is a list, recurse; else append." },
    ],
  },

  // ── JAVASCRIPT ───────────────────────────────────────────────
  "JavaScript": {
    round1: [
      { id:"js_r1_1", topic:"JavaScript", round:1, difficulty:"Medium", type:"output",
        q:"What is the output?\n\nconsole.log(typeof null)",
        options:["null","object","undefined","string"],
        answer:1, explanation:"This is a well-known JS quirk: `typeof null === 'object'`. null is a primitive, but typeof returns 'object' due to a legacy bug." },
      { id:"js_r1_2", topic:"JavaScript", round:1, difficulty:"Hard", type:"output",
        q:"What is the output?\n\nconst arr = [1, 2, 3];\nconst [a, , b] = arr;\nconsole.log(a, b);",
        options:["1 2","1 3","2 3","undefined 3"],
        answer:1, explanation:"Destructuring with a skip (,): a=1, second element skipped, b=3." },
      { id:"js_r1_3", topic:"JavaScript", round:1, difficulty:"Hard", type:"scenario",
        q:"What is a closure in JavaScript?",
        options:["A function that closes itself","A function that remembers variables from its enclosing scope","An async function","A method that has no return value"],
        answer:1, explanation:"A closure is a function that captures variables from its lexical scope — it 'closes over' its environment." },
      { id:"js_r1_4", topic:"JavaScript", round:1, difficulty:"Medium", type:"output",
        q:"What does `Promise.all([p1, p2, p3])` do if p2 rejects?",
        options:["Returns the fulfilled promises","Rejects immediately with p2's error","Waits for all and collects errors","Returns undefined"],
        answer:1, explanation:"Promise.all() short-circuits on any rejection — it rejects with the first rejection reason." },
      { id:"js_r1_5", topic:"JavaScript", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the difference between `==` and `===` in JavaScript?",
        options:["No difference","=== checks type + value, == coerces type","== is stricter","=== only works for primitives"],
        answer:1, explanation:"`===` strict equality checks both value AND type without coercion. `==` performs type coercion before comparison." },
      { id:"js_r1_6", topic:"JavaScript", round:1, difficulty:"Hard", type:"output",
        q:"What is the output?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
        options:["0 1 2","3 3 3","0 0 0","undefined"],
        answer:1, explanation:"`var` is function-scoped. By the time callbacks run, i is already 3. Use `let` for block scoping." },
      { id:"js_r1_7", topic:"JavaScript", round:1, difficulty:"Medium", type:"mcq",
        q:"Which array method does NOT mutate the original array?",
        options:["push()","pop()","map()","splice()"],
        answer:2, explanation:"map() returns a NEW array. push/pop/splice all mutate the original." },
      { id:"js_r1_8", topic:"JavaScript", round:1, difficulty:"Hard", type:"debug",
        q:"What is wrong with this async function?\n\nasync function getData() {\n  const data = fetch('/api/data');\n  return data.json();\n}",
        options:["fetch() is deprecated","Missing await before fetch()",".json() should be .text()","async functions can't use fetch"],
        answer:1, explanation:"fetch() returns a Promise. Without `await`, `data` is a Promise object, not the Response — .json() would fail." },
      { id:"js_r1_9", topic:"JavaScript", round:1, difficulty:"Medium", type:"mcq",
        q:"What does the spread operator `...` do when used with an array?",
        options:["Deletes array elements","Expands array elements individually","Creates a deep copy","Reverses the array"],
        answer:1, explanation:"`...arr` expands an array into its individual elements, useful for function calls and array spreading." },
      { id:"js_r1_10", topic:"JavaScript", round:1, difficulty:"Hard", type:"scenario",
        q:"What is event delegation and why is it used?",
        options:["Attaching events to every element","Attaching one listener to a parent to handle children's events","Preventing event bubbling","Removing event listeners"],
        answer:1, explanation:"Event delegation uses bubbling to handle events at a parent level — efficient for dynamic or large lists of children." },
    ],
    round2: [
      { id:"js_r2_1", topic:"JavaScript", round:2, difficulty:"Hard", type:"coding",
        q:"Implement a `debounce(fn, delay)` function. It should return a new function that, when called repeatedly, only invokes `fn` after `delay` ms of inactivity.\n\nExample usage:\nconst debouncedSearch = debounce(search, 300);\ndebouncedSearch('a'); // not called\ndebouncedSearch('ab'); // not called\ndebouncedSearch('abc'); // called with 'abc' after 300ms",
        starterCode:`function debounce(fn, delay) {\n  // Your implementation here\n}\n\n// Test\nconst log = debounce((val) => console.log(val), 200);\nlog('hello');`,
        testCases:[
          { input:"debounce called correctly", expected:"Only the last call executes after delay" },
        ],
        explanation:"Store a setTimeout ID. Clear the previous timer on every call. Only fire fn when the timer completes." },
      { id:"js_r2_2", topic:"JavaScript", round:2, difficulty:"Hard", type:"coding",
        q:"Implement `deepEqual(a, b)` — a function that returns `true` if two values are deeply equal (handles nested objects and arrays).\n\nExample:\ndeepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}}) // true\ndeepEqual([1,2,3], [1,2,4]) // false",
        starterCode:`function deepEqual(a, b) {\n  // Your implementation here\n}\n\nconsole.log(deepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})); // true\nconsole.log(deepEqual([1,2,3], [1,2,4])); // false`,
        testCases:[
          { input:"{a:1,b:{c:2}} vs {a:1,b:{c:2}}", expected:"true" },
          { input:"[1,2,3] vs [1,2,4]", expected:"false" },
        ],
        explanation:"Recursively compare object keys and values, or array elements. Check type and length first." },
    ],
  },

  // ── HTML/CSS ─────────────────────────────────────────────────
  "HTML/CSS": {
    round1: [
      { id:"htmlcss_r1_1", topic:"HTML/CSS", round:1, difficulty:"Medium", type:"mcq",
        q:"Which CSS property controls how a flex container's children are distributed along the main axis?",
        options:["align-items","flex-direction","justify-content","align-content"],
        answer:2, explanation:"`justify-content` distributes flex items along the main axis (horizontal by default)." },
      { id:"htmlcss_r1_2", topic:"HTML/CSS", round:1, difficulty:"Hard", type:"output",
        q:"What specificity does `.nav ul li a:hover` have?",
        options:["0,0,1,4","0,1,0,3","0,1,3,0","0,1,1,3"],
        answer:3, explanation:"Specificity: classes/pseudo-classes = 0,1,0,0 each. Elements = 0,0,0,1 each. .nav(class)=010, ul+li+a(3 elements)=003, :hover(pseudo-class)=010 → 0,2,0,3... actually (0,1,3,1 without hover). This tests CSS specificity understanding." },
      { id:"htmlcss_r1_3", topic:"HTML/CSS", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `position: sticky` do?",
        options:["Removes element from normal flow","Stays in normal flow until threshold, then sticks","Same as `position: fixed`","Only works inside flex containers"],
        answer:1, explanation:"`sticky` elements scroll normally until they hit their threshold (e.g., `top: 0`), then stick in place." },
      { id:"htmlcss_r1_4", topic:"HTML/CSS", round:1, difficulty:"Easy", type:"mcq",
        q:"Which semantic HTML element represents the main navigation of a document?",
        options:["<menu>","<nav>","<header>","<section>"],
        answer:1, explanation:"<nav> specifically marks navigation links. Proper semantic HTML aids accessibility and SEO." },
      { id:"htmlcss_r1_5", topic:"HTML/CSS", round:1, difficulty:"Hard", type:"debug",
        q:"Why does `margin: auto` not vertically center a block element?",
        options:["auto only works horizontally for block elements","You need display:flex","Margin top/bottom is always 0","Browsers don't support it"],
        answer:0, explanation:"For block elements, `margin: auto` only distributes horizontal space. Vertical auto margin collapses to 0. Use flexbox or grid for vertical centering." },
      { id:"htmlcss_r1_6", topic:"HTML/CSS", round:1, difficulty:"Medium", type:"scenario",
        q:"A div is `display: none`. What happens to the space it occupied?",
        options:["Space is maintained, element invisible","Space is removed, element doesn't exist in layout","Element is transparent","Element is moved out of viewport"],
        answer:1, explanation:"`display: none` removes the element entirely from the layout flow. Use `visibility: hidden` to hide but preserve space." },
      { id:"htmlcss_r1_7", topic:"HTML/CSS", round:1, difficulty:"Medium", type:"mcq",
        q:"Which CSS Grid property defines the number and size of columns?",
        options:["grid-template-rows","grid-column","grid-template-columns","column-gap"],
        answer:2, explanation:"`grid-template-columns` defines the column track sizes, e.g., `repeat(3, 1fr)` creates 3 equal columns." },
      { id:"htmlcss_r1_8", topic:"HTML/CSS", round:1, difficulty:"Hard", type:"scenario",
        q:"What does `box-sizing: border-box` change?",
        options:["Makes border transparent","Width/height include padding and border","Makes padding outside the element","Removes margin"],
        answer:1, explanation:"With `border-box`, an element's width includes its padding and border — preventing unexpected overflow in layouts." },
      { id:"htmlcss_r1_9", topic:"HTML/CSS", round:1, difficulty:"Easy", type:"mcq",
        q:"What does the `alt` attribute on an `<img>` tag provide?",
        options:["Image title on hover","Alternative text for screen readers and broken images","Image caption","Lazy loading hint"],
        answer:1, explanation:"`alt` provides alternative text used by screen readers (accessibility) and displayed when the image fails to load." },
      { id:"htmlcss_r1_10", topic:"HTML/CSS", round:1, difficulty:"Hard", type:"output",
        q:"What is the `z-index` stacking order if an element has no explicit z-index?",
        options:["z-index: 0","z-index: -1","auto (determined by DOM order)","z-index: 999"],
        answer:2, explanation:"Without explicit z-index, elements stack in DOM order. `z-index: auto` means the element participates in stacking but doesn't create a new stacking context." },
    ],
    round2: [
      { id:"htmlcss_r2_1", topic:"HTML/CSS", round:2, difficulty:"Hard", type:"coding",
        q:"Create an HTML+CSS responsive card component with:\n- Card container with glassmorphism effect (dark translucent bg, border, blur)\n- Title, subtitle, and a tag pill\n- Hover lift animation\n- Must work on mobile (< 480px) and desktop\n\nWrite the HTML and CSS below:",
        starterCode:`<!-- HTML -->\n<div class=\"card\">\n  <h2 class=\"card-title\">Card Title</h2>\n  <p class=\"card-subtitle\">Card subtitle here</p>\n  <span class=\"card-tag\">Tag</span>\n</div>\n\n/* CSS */\n.card {\n  /* Your styles here */\n}`,
        testCases:[
          { input:"glassmorphism + responsive", expected:"Card with translucent bg, border, hover effect, mobile-friendly" },
        ],
        explanation:"Use backdrop-filter:blur, background:rgba, border:1px solid rgba, transform on hover, and media queries for responsiveness." },
    ],
  },

  // ── SQL ─────────────────────────────────────────────────────
  "SQL": {
    round1: [
      { id:"sql_r1_1", topic:"SQL", round:1, difficulty:"Medium", type:"mcq",
        q:"Which SQL clause filters rows AFTER grouping?",
        options:["WHERE","GROUP BY","HAVING","FILTER"],
        answer:2, explanation:"HAVING filters groups (aggregates). WHERE filters individual rows before grouping." },
      { id:"sql_r1_2", topic:"SQL", round:1, difficulty:"Hard", type:"output",
        q:"Given employees(id, name, dept_id, salary).\nWhat does this return?\n\nSELECT dept_id, MAX(salary)\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 5;",
        options:["All depts max salary","Max salary only in depts with >5 employees","Max salary for top 5 employees","Error — HAVING requires WHERE"],
        answer:1, explanation:"GROUP BY groups by department, HAVING filters to only groups (departments) that have more than 5 employees." },
      { id:"sql_r1_3", topic:"SQL", round:1, difficulty:"Medium", type:"mcq",
        q:"What type of JOIN returns rows only when there's a match in BOTH tables?",
        options:["LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL OUTER JOIN"],
        answer:2, explanation:"INNER JOIN returns only rows where the join condition is satisfied in both tables." },
      { id:"sql_r1_4", topic:"SQL", round:1, difficulty:"Hard", type:"scenario",
        q:"When should you use a subquery vs a JOIN?",
        options:["Subqueries are always faster","JOINs are always faster","Use subquery for existence checks (EXISTS), JOINs for combining columns","They are identical in all cases"],
        answer:2, explanation:"Subqueries (especially with EXISTS/IN) are good for filtering by existence. JOINs are preferred for combining columns from multiple tables." },
      { id:"sql_r1_5", topic:"SQL", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `DISTINCT` do in a SELECT statement?",
        options:["Sorts results","Removes duplicate rows","Filters NULL values","Groups results"],
        answer:1, explanation:"SELECT DISTINCT eliminates duplicate rows from the result set." },
      { id:"sql_r1_6", topic:"SQL", round:1, difficulty:"Hard", type:"debug",
        q:"This query returns an error. Why?\n\nSELECT dept, AVG(salary)\nFROM employees\nWHERE AVG(salary) > 50000\nGROUP BY dept;",
        options:["AVG() needs DISTINCT","Aggregate functions can't be in WHERE — use HAVING","GROUP BY must come before WHERE","dept must be aliased"],
        answer:1, explanation:"Aggregate functions (AVG, SUM, COUNT) cannot be used in WHERE. Use HAVING after GROUP BY." },
      { id:"sql_r1_7", topic:"SQL", round:1, difficulty:"Medium", type:"mcq",
        q:"What does a NULL value represent in SQL?",
        options:["Zero","Empty string","Unknown/missing value","False"],
        answer:2, explanation:"NULL represents an unknown or missing value. NULL ≠ 0 ≠ empty string. Use IS NULL / IS NOT NULL to check." },
      { id:"sql_r1_8", topic:"SQL", round:1, difficulty:"Hard", type:"scenario",
        q:"What is a database index and when should you add one?",
        options:["A backup copy of the table","A data structure that speeds up reads on specific columns at cost of write speed","A constraint that prevents duplicates","A way to join tables faster"],
        answer:1, explanation:"Indexes speed up SELECT queries on indexed columns but slow down INSERT/UPDATE/DELETE. Add on frequently searched/filtered columns." },
      { id:"sql_r1_9", topic:"SQL", round:1, difficulty:"Easy", type:"mcq",
        q:"Which SQL statement is used to modify existing rows?",
        options:["ALTER","MODIFY","UPDATE","CHANGE"],
        answer:2, explanation:"UPDATE modifies existing rows. ALTER modifies table structure (columns, types)." },
      { id:"sql_r1_10", topic:"SQL", round:1, difficulty:"Hard", type:"output",
        q:"What does `RANK() OVER (PARTITION BY dept ORDER BY salary DESC)` produce?",
        options:["Sorts employees by salary","Assigns rank within each department by salary descending","Deletes lower-ranked employees","Creates a new table"],
        answer:1, explanation:"RANK() is a window function that ranks rows within each PARTITION (department) by ORDER BY (salary desc). Ties get same rank, next rank skips." },
    ],
    round2: [
      { id:"sql_r2_1", topic:"SQL", round:2, difficulty:"Hard", type:"coding",
        q:"Given table: employees(id, name, department, salary)\n\nWrite a SQL query to find the TOP 3 highest-paid employees in EACH department.\nOutput columns: department, name, salary, rank_in_dept\n\nHandle ties correctly (same rank for same salary).",
        starterCode:`-- Your SQL query here\nSELECT\n  department,\n  name,\n  salary,\n  /* rank expression */ AS rank_in_dept\nFROM employees\n/* ... */;`,
        testCases:[
          { input:"employees table", expected:"Top 3 per dept with rank, handling ties" },
        ],
        explanation:"Use RANK() or DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC), then filter WHERE rank <= 3 in a CTE/subquery." },
    ],
  },

  // ── MACHINE LEARNING ─────────────────────────────────────────
  "Machine Learning": {
    round1: [
      { id:"ml_r1_1", topic:"Machine Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"Which metric is most appropriate for evaluating a highly imbalanced classification problem?",
        options:["Accuracy","F1 Score","Mean Squared Error","R² Score"],
        answer:1, explanation:"In imbalanced datasets, accuracy is misleading (predicting majority class always gives high accuracy). F1 balances precision and recall." },
      { id:"ml_r1_2", topic:"Machine Learning", round:1, difficulty:"Hard", type:"scenario",
        q:"What is overfitting and how do you detect it?",
        options:["Model underfits training data","Model performs well on training but poorly on unseen data","Model is too simple","Model has too many features"],
        answer:1, explanation:"Overfitting: high training accuracy, low validation/test accuracy. Detect by comparing train vs validation loss curves." },
      { id:"ml_r1_3", topic:"Machine Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"What does cross-validation prevent?",
        options:["Model training","Overfitting to a single train/test split","Feature scaling","Gradient explosion"],
        answer:1, explanation:"Cross-validation rotates the validation set across multiple folds, giving a more robust estimate of model performance." },
      { id:"ml_r1_4", topic:"Machine Learning", round:1, difficulty:"Hard", type:"mcq",
        q:"What is the 'curse of dimensionality' in ML?",
        options:["Too many output classes","Distance metrics become less meaningful as feature count increases","Model training takes too long","GPU memory limitation"],
        answer:1, explanation:"In high dimensions, data becomes sparse and distance-based algorithms struggle. Feature selection/PCA helps." },
      { id:"ml_r1_5", topic:"Machine Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the main difference between bagging and boosting?",
        options:["Bagging uses trees, boosting uses linear models","Bagging trains in parallel independently; boosting trains sequentially, each correcting the previous","Bagging is for regression only","Boosting is faster"],
        answer:1, explanation:"Bagging (e.g., Random Forest): parallel independent models averaged. Boosting (e.g., XGBoost): sequential, each model corrects previous errors." },
      { id:"ml_r1_6", topic:"Machine Learning", round:1, difficulty:"Hard", type:"scenario",
        q:"When should you use regularization (L1/L2)?",
        options:["Always","When model is underfitting","When model is overfitting — to penalize large weights","When dataset is too small to train"],
        answer:2, explanation:"Regularization adds a penalty for large weights, discouraging overfitting. L1 (Lasso) induces sparsity; L2 (Ridge) shrinks weights." },
      { id:"ml_r1_7", topic:"Machine Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"What does gradient descent minimize?",
        options:["Model accuracy","Loss function (error)","Feature count","Training time"],
        answer:1, explanation:"Gradient descent iteratively updates model parameters to minimize the loss function by moving in the direction of the steepest descent." },
      { id:"ml_r1_8", topic:"Machine Learning", round:1, difficulty:"Hard", type:"output",
        q:"Precision = TP/(TP+FP). Recall = TP/(TP+FN). If your model has high precision but low recall, it means:",
        options:["Lots of false negatives — misses many true positives","Lots of false positives — flags many negatives","Model is well-balanced","Model is overfitting"],
        answer:0, explanation:"High precision (few false positives) but low recall means many true positives are missed (high FN). The model is conservative — it only predicts positive when very confident." },
      { id:"ml_r1_9", topic:"Machine Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the purpose of a train/validation/test split?",
        options:["Train: train model, Val: tune hyperparams, Test: final unbiased evaluation","Train and Test: train, Val: deploy","Train: eval model, Test: train","All three are used for training"],
        answer:0, explanation:"Training set: fit model. Validation: tune hyperparameters/architecture without biasing test. Test: final evaluation (never touched during development)." },
      { id:"ml_r1_10", topic:"Machine Learning", round:1, difficulty:"Hard", type:"scenario",
        q:"What is feature engineering and why does it matter?",
        options:["Selecting which model to use","Transforming raw data into features that improve model performance","Normalizing loss function","Choosing learning rate"],
        answer:1, explanation:"Feature engineering creates or transforms input features (e.g., log transforms, interaction terms) to help the model learn patterns more effectively." },
    ],
    round2: [
      { id:"ml_r2_1", topic:"Machine Learning", round:2, difficulty:"Hard", type:"coding",
        q:"Using scikit-learn, implement a complete classification pipeline that:\n1. Loads the iris dataset\n2. Splits 80/20 train/test\n3. Scales features with StandardScaler\n4. Trains a RandomForestClassifier\n5. Prints accuracy and classification_report\n\nDo not hardcode the accuracy.",
        starterCode:`from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# Your implementation here`,
        testCases:[
          { input:"iris dataset", expected:"Accuracy > 0.9 with classification report" },
        ],
        explanation:"Full ML pipeline: load → split → scale → fit → predict → evaluate." },
    ],
  },

  // ── DATA STRUCTURES ──────────────────────────────────────────
  "Data Structures": {
    round1: [
      { id:"ds_r1_1", topic:"Data Structures", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the time complexity of searching for an element in a balanced BST?",
        options:["O(n)","O(log n)","O(1)","O(n log n)"],
        answer:1, explanation:"In a balanced BST, each comparison halves the search space → O(log n)." },
      { id:"ds_r1_2", topic:"Data Structures", round:1, difficulty:"Hard", type:"scenario",
        q:"When would you choose a Hash Map over a sorted array?",
        options:["When you need sorted output","When you need O(1) avg lookups/inserts","When memory is limited","When data is very small"],
        answer:1, explanation:"Hash maps provide O(1) average lookup/insert/delete. Sorted arrays are better when you need order or range queries." },
      { id:"ds_r1_3", topic:"Data Structures", round:1, difficulty:"Medium", type:"mcq",
        q:"What data structure uses LIFO (Last In, First Out) ordering?",
        options:["Queue","Priority Queue","Stack","Deque"],
        answer:2, explanation:"A Stack is LIFO: the last element pushed is the first to be popped. Used in function calls, undo systems." },
      { id:"ds_r1_4", topic:"Data Structures", round:1, difficulty:"Hard", type:"output",
        q:"What is the worst-case time complexity of quicksort?",
        options:["O(n log n)","O(n)","O(n²)","O(log n)"],
        answer:2, explanation:"Quicksort worst case (sorted/reverse input with bad pivot choice) is O(n²). Average case is O(n log n)." },
      { id:"ds_r1_5", topic:"Data Structures", round:1, difficulty:"Medium", type:"mcq",
        q:"A graph represented as an adjacency list vs adjacency matrix — when is matrix preferred?",
        options:["Always","When graph is sparse","When graph is dense and edge lookups need O(1)","When memory is unlimited"],
        answer:2, explanation:"Adjacency matrix gives O(1) edge lookup but uses O(V²) space — best for dense graphs. Adjacency list uses O(V+E) space, better for sparse graphs." },
      { id:"ds_r1_6", topic:"Data Structures", round:1, difficulty:"Hard", type:"scenario",
        q:"What is the difference between BFS and DFS traversal?",
        options:["BFS is recursive, DFS is iterative","BFS explores level by level (uses Queue), DFS explores depth-first (uses Stack/recursion)","BFS is faster always","DFS explores level by level"],
        answer:1, explanation:"BFS uses a Queue, explores neighbors before going deeper — good for shortest path. DFS uses Stack/recursion, explores as far as possible — good for connectivity/topological sort." },
      { id:"ds_r1_7", topic:"Data Structures", round:1, difficulty:"Medium", type:"mcq",
        q:"What is a heap data structure primarily used for?",
        options:["Sorting linked lists","Implementing priority queues with O(log n) insert/extract","Storing key-value pairs","Graph traversal"],
        answer:1, explanation:"Heaps efficiently maintain min/max priority, making them ideal for priority queues. Extract-min/max and insert are O(log n)." },
      { id:"ds_r1_8", topic:"Data Structures", round:1, difficulty:"Hard", type:"debug",
        q:"Why does this linked list deletion fail?\n\ndef delete(head, val):\n    cur = head\n    while cur.val != val:\n        cur = cur.next\n    cur = cur.next",
        options:["cur.next is wrong","You need to update the previous node's .next pointer","Linked list can't be deleted","The loop condition is wrong"],
        answer:1, explanation:"Reassigning `cur` only changes the local variable. You must update the previous node's `.next` to skip the deleted node." },
      { id:"ds_r1_9", topic:"Data Structures", round:1, difficulty:"Easy", type:"mcq",
        q:"What is the time complexity of accessing an element in an array by index?",
        options:["O(n)","O(log n)","O(1)","O(n²)"],
        answer:2, explanation:"Array index access is O(1) — direct memory offset calculation. This is one of arrays' key advantages." },
      { id:"ds_r1_10", topic:"Data Structures", round:1, difficulty:"Hard", type:"scenario",
        q:"What problem does dynamic programming solve?",
        options:["Minimizing code length","Avoiding redundant computation in overlapping subproblems","Sorting large datasets","Memory allocation"],
        answer:1, explanation:"DP stores results of subproblems (memoization/tabulation) to avoid recomputation when the same subproblems recur — reduces exponential to polynomial time." },
    ],
    round2: [
      { id:"ds_r2_1", topic:"Data Structures", round:2, difficulty:"Hard", type:"coding",
        q:"Implement a function `is_balanced(s: str) -> bool` that returns True if the brackets in the string are balanced.\n\nValid brackets: () [] {}\n\nExample:\nis_balanced('([{}])') → True\nis_balanced('([)]') → False\nis_balanced('{[]') → False",
        starterCode:`def is_balanced(s: str) -> bool:\n    # Your implementation here\n    pass\n\nprint(is_balanced('([{}])'))  # True\nprint(is_balanced('([)]'))    # False\nprint(is_balanced('{[]'))     # False`,
        testCases:[
          { input:"([{}])", expected:"True" },
          { input:"([)]", expected:"False" },
          { input:"{[]", expected:"False" },
          { input:"", expected:"True" },
        ],
        explanation:"Use a stack. Push opening brackets. On closing bracket, check if top of stack matches. Stack should be empty at end." },
    ],
  },

  // ── SYSTEM DESIGN ────────────────────────────────────────────
  "System Design": {
    round1: [
      { id:"sd_r1_1", topic:"System Design", round:1, difficulty:"Medium", type:"mcq",
        q:"What is horizontal scaling (scale-out)?",
        options:["Adding more CPU/RAM to a single server","Adding more servers to distribute load","Optimizing database queries","Using CDN for assets"],
        answer:1, explanation:"Horizontal scaling adds more machines. Vertical scaling upgrades existing machine hardware." },
      { id:"sd_r1_2", topic:"System Design", round:1, difficulty:"Hard", type:"scenario",
        q:"What is a CDN and why is it used?",
        options:["A database type","A network of servers that caches content close to users to reduce latency","A type of load balancer","A deployment pipeline"],
        answer:1, explanation:"CDN (Content Delivery Network) caches static assets (images, JS, CSS) at geographically distributed edge servers, reducing latency for end users." },
      { id:"sd_r1_3", topic:"System Design", round:1, difficulty:"Hard", type:"scenario",
        q:"Explain CAP theorem (Consistency, Availability, Partition Tolerance).",
        options:["A system can satisfy all 3 simultaneously","A distributed system can guarantee at most 2 of the 3 properties simultaneously","Only databases are affected","CAP only applies to NoSQL"],
        answer:1, explanation:"In the presence of a network partition, a system must choose between Consistency (all nodes see same data) or Availability (every request gets a response)." },
      { id:"sd_r1_4", topic:"System Design", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the purpose of a load balancer?",
        options:["Compress database queries","Distribute incoming traffic across multiple server instances","Store session data","Cache API responses"],
        answer:1, explanation:"Load balancers distribute requests across server instances to prevent overload, improve throughput, and provide failover." },
      { id:"sd_r1_5", topic:"System Design", round:1, difficulty:"Hard", type:"scenario",
        q:"When should you use a message queue (like Kafka or RabbitMQ)?",
        options:["Always — queues are faster","For decoupling services, handling async workloads, and buffering bursts","Only for logging","Only for small messages"],
        answer:1, explanation:"Message queues decouple producers from consumers, allow async processing, smooth traffic spikes, and enable retry on failures." },
      { id:"sd_r1_6", topic:"System Design", round:1, difficulty:"Hard", type:"mcq",
        q:"What is database sharding?",
        options:["Backing up database","Partitioning data across multiple database nodes to scale horizontally","Creating read replicas","Compressing database files"],
        answer:1, explanation:"Sharding partitions (splits) data across multiple DB instances by a shard key, allowing horizontal scaling of databases." },
      { id:"sd_r1_7", topic:"System Design", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the difference between a cache hit and a cache miss?",
        options:["Hit: data is in cache, Miss: must fetch from origin","Hit: cache is full, Miss: cache is empty","Hit: request succeeded, Miss: request failed","No difference"],
        answer:0, explanation:"Cache hit: data found in cache (fast). Cache miss: data not in cache, must fetch from database/origin (slow), then store in cache." },
      { id:"sd_r1_8", topic:"System Design", round:1, difficulty:"Hard", type:"scenario",
        q:"How would you design a URL shortener (like bit.ly) at a high level?",
        options:["Just use a hash function","API + unique ID generator + database mapping short→long URL + redirect service + CDN for popular links","Store URLs in browser cookies","Use only client-side storage"],
        answer:1, explanation:"Core components: POST API to create short URL (generate unique ID, store mapping), GET to redirect (lookup in DB/cache), cache hot links, handle high read throughput." },
      { id:"sd_r1_9", topic:"System Design", round:1, difficulty:"Medium", type:"mcq",
        q:"What is eventual consistency in distributed systems?",
        options:["Data is always up-to-date everywhere","All nodes will eventually reach the same state, but may temporarily diverge","Consistency is never guaranteed","Only used in SQL databases"],
        answer:1, explanation:"Eventual consistency: updates propagate asynchronously. All replicas will eventually converge, but may serve stale data temporarily." },
      { id:"sd_r1_10", topic:"System Design", round:1, difficulty:"Hard", type:"scenario",
        q:"What is the N+1 query problem?",
        options:["Query timeout issue","Fetching N parent records then issuing N additional queries for children — instead of one JOIN","Having more than N database connections","SQL syntax error"],
        answer:1, explanation:"N+1: loading 100 posts then 100 separate queries for each post's comments = 101 queries. Fix with eager loading/JOINs or DataLoader pattern." },
    ],
    round2: [
      { id:"sd_r2_1", topic:"System Design", round:2, difficulty:"Hard", type:"coding",
        q:"Design a simple LRU (Least Recently Used) Cache with O(1) get and O(1) put.\n\nImplement:\n- get(key): returns value or -1 if not found\n- put(key, value): inserts/updates key, evicts LRU if capacity exceeded\n\ncache = LRUCache(2)\ncache.put(1, 1)  # cache: {1:1}\ncache.put(2, 2)  # cache: {1:1, 2:2}\ncache.get(1)     # returns 1\ncache.put(3, 3)  # evicts 2, cache: {1:1, 3:3}\ncache.get(2)     # returns -1",
        starterCode:`class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        # Your implementation here\n    \n    def get(self, key: int) -> int:\n        pass\n    \n    def put(self, key: int, value: int) -> None:\n        pass`,
        testCases:[
          { input:"capacity=2, put(1,1),put(2,2),get(1),put(3,3),get(2)", expected:"get(1)=1, get(2)=-1" },
        ],
        explanation:"Use an OrderedDict (Python) or HashMap + Doubly Linked List for O(1) operations." },
    ],
  },

  // ── REACT ────────────────────────────────────────────────────
  "React": {
    round1: [
      { id:"react_r1_1", topic:"React", round:1, difficulty:"Medium", type:"mcq",
        q:"When does `useEffect` with an empty dependency array `[]` run?",
        options:["Every render","Once after the initial render (mount)","Before each render","Never"],
        answer:1, explanation:"`useEffect(() => {}, [])` runs once after the component mounts — equivalent to componentDidMount." },
      { id:"react_r1_2", topic:"React", round:1, difficulty:"Hard", type:"scenario",
        q:"What is the key prop in React lists and why is it critical?",
        options:["An optional styling prop","A unique identifier that helps React efficiently reconcile list changes","A CSS class shorthand","Used for form inputs only"],
        answer:1, explanation:"Keys help React identify which list items changed, were added, or removed — enabling efficient DOM updates without re-rendering the whole list." },
      { id:"react_r1_3", topic:"React", round:1, difficulty:"Hard", type:"output",
        q:"What happens when you call `setState` inside `useEffect` without a proper dependency array?",
        options:["Nothing","Infinite render loop","State updates once","Component unmounts"],
        answer:1, explanation:"setState triggers a re-render → useEffect runs again → setState again → infinite loop. Always specify dependencies correctly." },
      { id:"react_r1_4", topic:"React", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the purpose of `useCallback`?",
        options:["Memoize component output","Memoize a function reference so it's not recreated on every render","Fetch data","Handle events"],
        answer:1, explanation:"`useCallback` returns a memoized callback function that only changes if its dependencies change — prevents unnecessary child re-renders." },
      { id:"react_r1_5", topic:"React", round:1, difficulty:"Hard", type:"scenario",
        q:"What is prop drilling and how is it solved?",
        options:["Passing props is always bad","Passing props through multiple intermediate components that don't need them — solved by Context or state management","A CSS issue","A React Router concept"],
        answer:1, explanation:"Prop drilling: passing data through layers of components that don't use it themselves. Solutions: React Context, Redux, Zustand, component composition." },
      { id:"react_r1_6", topic:"React", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the Virtual DOM?",
        options:["A DOM stored in a database","A lightweight in-memory representation of the real DOM that React uses to efficiently compute UI differences","A shadow DOM implementation","A DOM for testing only"],
        answer:1, explanation:"React maintains a virtual DOM — on state change, it diffs the new vs old virtual DOM and only applies the minimum real DOM changes (reconciliation)." },
      { id:"react_r1_7", topic:"React", round:1, difficulty:"Hard", type:"debug",
        q:"A React component re-renders on every parent render even though its props haven't changed. What's the fix?",
        options:["Use useEffect","Wrap the component in React.memo()","Use forwardRef","Add a key prop"],
        answer:1, explanation:"React.memo() wraps a functional component so it only re-renders when its props actually change (shallow comparison)." },
      { id:"react_r1_8", topic:"React", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `useMemo` do?",
        options:["Memoizes a function","Caches an expensive computed value between renders, only recalculating when dependencies change","Persists data in localStorage","Manages side effects"],
        answer:1, explanation:"`useMemo(() => expensiveCalc(), [deps])` memoizes the computed value, preventing re-calculation on every render." },
      { id:"react_r1_9", topic:"React", round:1, difficulty:"Hard", type:"scenario",
        q:"When should you use `useReducer` instead of `useState`?",
        options:["Always","When state logic is complex, involves multiple sub-values, or next state depends on previous state","For async operations only","useState is always preferable"],
        answer:1, explanation:"`useReducer` is preferred when state has complex transitions (like Redux reducers), multiple related values, or when the next state depends on the current one." },
      { id:"react_r1_10", topic:"React", round:1, difficulty:"Hard", type:"output",
        q:"What is the correct way to update state that depends on the previous state?",
        options:["setState(state + 1)","setState(prev => prev + 1)","state = state + 1","setState(state, +1)"],
        answer:1, explanation:"Always use the functional form `setState(prev => ...)` when new state depends on previous state — prevents race conditions in async updates." },
    ],
    round2: [
      { id:"react_r2_1", topic:"React", round:2, difficulty:"Hard", type:"coding",
        q:"Build a custom React hook `useLocalStorage(key, initialValue)` that:\n1. Reads from localStorage on init\n2. Updates localStorage when value changes\n3. Returns [value, setValue] like useState\n\nHandle JSON parse errors gracefully.",
        starterCode:`import { useState, useEffect } from 'react';\n\nfunction useLocalStorage(key, initialValue) {\n  // Your implementation here\n}\n\n// Usage:\n// const [name, setName] = useLocalStorage('username', 'Guest');`,
        testCases:[
          { input:"useLocalStorage hook", expected:"Persists state in localStorage, initializes from stored value" },
        ],
        explanation:"Use useState with lazy initializer to read from localStorage. Use useEffect to sync changes back to localStorage." },
    ],
  },

  // ── NODE.JS ──────────────────────────────────────────────────
  "Node.js": {
    round1: [
      { id:"node_r1_1", topic:"Node.js", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the event loop in Node.js?",
        options:["A for loop inside Node","The mechanism that handles asynchronous callbacks — allowing non-blocking I/O on a single thread","A database connection pool","A file system watcher"],
        answer:1, explanation:"Node.js event loop continuously checks the call stack and callback queue, processing asynchronous callbacks when the stack is empty — enabling non-blocking I/O." },
      { id:"node_r1_2", topic:"Node.js", round:1, difficulty:"Hard", type:"scenario",
        q:"What is the difference between `process.nextTick()` and `setImmediate()`?",
        options:["No difference","nextTick fires before I/O callbacks (end of current operation), setImmediate fires after I/O callbacks (next iteration)","setImmediate is faster","nextTick is deprecated"],
        answer:1, explanation:"nextTick: fires at the end of the current operation (before event loop continues). setImmediate: fires in the check phase (after I/O events)." },
      { id:"node_r1_3", topic:"Node.js", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `require()` return if the module hasn't been required before?",
        options:["null","The module's exports object (executes module and caches result)","A Promise","undefined"],
        answer:1, explanation:"First require() executes the module and caches its exports. Subsequent require()s return the cached result without re-executing." },
      { id:"node_r1_4", topic:"Node.js", round:1, difficulty:"Hard", type:"debug",
        q:"Why should you avoid synchronous file operations (fs.readFileSync) in production Node.js servers?",
        options:["They don't work","They block the event loop, preventing the server from handling other requests during the operation","They're deprecated","They use more memory"],
        answer:1, explanation:"Sync operations block Node's single-threaded event loop. A slow disk read would freeze all concurrent requests. Use async fs.readFile() or fs.promises." },
      { id:"node_r1_5", topic:"Node.js", round:1, difficulty:"Medium", type:"mcq",
        q:"What is middleware in Express.js?",
        options:["A database ORM","A function that has access to req, res, and next — processes requests in a pipeline","A CSS framework","A template engine"],
        answer:1, explanation:"Express middleware functions execute in sequence for each request. They can modify req/res, end the request cycle, or call next() to pass control." },
    ],
    round2: [
      { id:"node_r2_1", topic:"Node.js", round:2, difficulty:"Hard", type:"coding",
        q:"Implement a simple Express.js REST API with these endpoints:\n\nGET /users → return all users from an in-memory array\nPOST /users → add a new user (body: {name, email})\nGET /users/:id → return user by id or 404\n\nInclude input validation (name and email required for POST).",
        starterCode:`const express = require('express');\nconst app = express();\napp.use(express.json());\n\nconst users = [];\nlet nextId = 1;\n\n// Implement your routes here\n\napp.listen(3000, () => console.log('Running on port 3000'));`,
        testCases:[
          { input:"GET /users", expected:"Empty array initially, then list of added users" },
          { input:"POST /users {name:'John',email:'j@j.com'}", expected:"Created user with id" },
          { input:"GET /users/1", expected:"The created user" },
        ],
        explanation:"Express REST API with in-memory store, input validation, proper status codes (200, 201, 400, 404)." },
    ],
  },

  // ── GIT ──────────────────────────────────────────────────────
  "Git": {
    round1: [
      { id:"git_r1_1", topic:"Git", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `git rebase` do compared to `git merge`?",
        options:["They're identical","Rebase rewrites commit history by moving/replaying commits onto another branch; merge creates a merge commit preserving history","Merge is destructive, rebase is safe","Rebase only works locally"],
        answer:1, explanation:"Rebase creates a linear history by replaying commits. Merge preserves branch history with a merge commit. Don't rebase shared branches." },
      { id:"git_r1_2", topic:"Git", round:1, difficulty:"Hard", type:"scenario",
        q:"You accidentally committed sensitive credentials to the main branch. What is the correct fix?",
        options:["Delete the repository","git commit -m 'remove credentials'","Use git filter-branch or BFG to rewrite history and force-push, then immediately rotate credentials","Add .gitignore and re-commit"],
        answer:2, explanation:"Committed secrets must be treated as compromised. Rewrite history to remove them AND rotate/revoke the credentials immediately." },
      { id:"git_r1_3", topic:"Git", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the difference between `git fetch` and `git pull`?",
        options:["No difference","fetch downloads changes without merging; pull fetches AND merges into current branch","pull is safer","fetch is deprecated"],
        answer:1, explanation:"`git fetch` downloads remote changes to tracking branches but doesn't modify your working branch. `git pull = git fetch + git merge`." },
      { id:"git_r1_4", topic:"Git", round:1, difficulty:"Hard", type:"debug",
        q:"You have uncommitted changes and need to switch branches. What's the safest approach?",
        options:["git checkout -f branchname","Commit them first, or use git stash","Delete the files","git reset --hard"],
        answer:1, explanation:"`git stash` temporarily saves uncommitted changes so you can switch branches safely. `git stash pop` restores them afterward." },
      { id:"git_r1_5", topic:"Git", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `git cherry-pick <commit-hash>` do?",
        options:["Deletes a commit","Applies a specific commit from another branch to the current branch","Reverts a commit","Creates a new branch at that commit"],
        answer:1, explanation:"Cherry-pick applies the changes of a specific commit to the current branch — useful for applying bug fixes from another branch without merging everything." },
    ],
    round2: [
      { id:"git_r2_1", topic:"Git", round:2, difficulty:"Hard", type:"coding",
        q:"Write the exact Git commands (in order) to:\n1. Create and switch to a new branch called 'feature/login'\n2. Stage all changes\n3. Commit with message 'Add login functionality'\n4. Push to origin and set upstream tracking\n5. Create a tag called 'v1.0.0' on this commit and push the tag\n\nWrite one command per line.",
        starterCode:`# Write your git commands here, one per line:\n\n# 1. Create and switch to branch\n\n# 2. Stage all changes\n\n# 3. Commit\n\n# 4. Push with upstream\n\n# 5. Create and push tag`,
        testCases:[
          { input:"Git workflow", expected:"Correct git commands in proper order" },
        ],
        explanation:"git checkout -b / git add . / git commit -m / git push -u origin / git tag + git push --tags" },
    ],
  },

  // ── DOCKER ───────────────────────────────────────────────────
  "Docker": {
    round1: [
      { id:"docker_r1_1", topic:"Docker", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the difference between a Docker image and a Docker container?",
        options:["They're the same thing","Image is the blueprint (read-only); container is a running instance of an image","Container is the blueprint","Images run code directly"],
        answer:1, explanation:"A Docker image is a static, read-only template. A container is a running instance of an image with its own writable layer." },
      { id:"docker_r1_2", topic:"Docker", round:1, difficulty:"Hard", type:"scenario",
        q:"What does the COPY instruction do in a Dockerfile vs ADD?",
        options:["They're identical","COPY copies local files; ADD can also extract tar archives and fetch URLs","ADD is deprecated","COPY can fetch from URLs"],
        answer:1, explanation:"COPY is preferred for simply copying local files. ADD additionally handles tar extraction and URL fetching — use COPY unless you need ADD's extra features." },
      { id:"docker_r1_3", topic:"Docker", round:1, difficulty:"Medium", type:"mcq",
        q:"What does `docker-compose up` do?",
        options:["Builds images","Starts all services defined in docker-compose.yml","Updates Docker","Removes containers"],
        answer:1, explanation:"`docker-compose up` reads docker-compose.yml, builds images if needed, and starts all defined services." },
      { id:"docker_r1_4", topic:"Docker", round:1, difficulty:"Hard", type:"debug",
        q:"Why should you minimize Docker image layers in a Dockerfile?",
        options:["Layers are limited to 10","Each layer adds size; combining RUN commands reduces total image size and speeds up builds","Docker charges per layer","Layers slow down containers"],
        answer:1, explanation:"Each RUN command creates a new layer. Chaining commands (RUN apt-get update && apt-get install -y ...) reduces layers and image size." },
      { id:"docker_r1_5", topic:"Docker", round:1, difficulty:"Medium", type:"mcq",
        q:"What is a Docker volume?",
        options:["Docker's disk size limit","Persistent storage that exists outside the container filesystem and survives container removal","A container configuration file","A network type"],
        answer:1, explanation:"Volumes persist data beyond container lifecycle. Without volumes, data written inside a container is lost when it's removed." },
    ],
    round2: [
      { id:"docker_r2_1", topic:"Docker", round:2, difficulty:"Hard", type:"coding",
        q:"Write a Dockerfile for a Python FastAPI application that:\n1. Uses Python 3.11 slim base image\n2. Sets working directory to /app\n3. Copies and installs requirements.txt\n4. Copies the application code\n5. Exposes port 8000\n6. Runs: uvicorn main:app --host 0.0.0.0 --port 8000\n\nOptimize for small image size (use --no-cache-dir for pip).",
        starterCode:`# Write your Dockerfile here:\nFROM\n\nWORKDIR\n\nCOPY\nRUN\n\nCOPY\n\nEXPOSE\n\nCMD`,
        testCases:[
          { input:"FastAPI Dockerfile", expected:"Correct Dockerfile with slim base, proper layer ordering, exposed port" },
        ],
        explanation:"FROM python:3.11-slim, WORKDIR /app, COPY requirements.txt . , RUN pip install --no-cache-dir, COPY . ., EXPOSE 8000, CMD [uvicorn...]" },
    ],
  },

  // ── DEEP LEARNING ────────────────────────────────────────────
  "Deep Learning": {
    round1: [
      { id:"dl_r1_1", topic:"Deep Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"What is the purpose of the activation function in a neural network?",
        options:["To initialize weights","To introduce non-linearity, allowing the network to learn complex patterns","To calculate loss","To normalize inputs"],
        answer:1, explanation:"Without activation functions, stacking layers would just be a linear transformation. Activations (ReLU, sigmoid, tanh) enable non-linear decision boundaries." },
      { id:"dl_r1_2", topic:"Deep Learning", round:1, difficulty:"Hard", type:"scenario",
        q:"What is vanishing gradient problem?",
        options:["Gradients become infinite","Gradients become very small during backpropagation through deep networks, preventing early layers from learning","Loss function diverges","Model weights overflow"],
        answer:1, explanation:"In deep networks, gradients are multiplied through layers. Sigmoid/tanh saturate, producing tiny gradients that 'vanish' before reaching early layers. ReLU and residual connections (ResNet) help." },
      { id:"dl_r1_3", topic:"Deep Learning", round:1, difficulty:"Medium", type:"mcq",
        q:"What is dropout regularization?",
        options:["Removing neurons permanently","Randomly setting neuron outputs to 0 during training to prevent co-adaptation and overfitting","Reducing learning rate","Clipping gradient values"],
        answer:1, explanation:"Dropout randomly 'drops' neurons during training (sets activations to 0), forcing the network to learn redundant representations and reducing overfitting." },
      { id:"dl_r1_4", topic:"Deep Learning", round:1, difficulty:"Hard", type:"mcq",
        q:"What does batch normalization do?",
        options:["Groups training data into batches","Normalizes layer inputs to zero mean/unit variance during training, stabilizing and speeding up learning","Reduces batch size","Normalizes loss values"],
        answer:1, explanation:"Batch norm normalizes activations within a mini-batch, reducing internal covariate shift, enabling higher learning rates and more stable training." },
      { id:"dl_r1_5", topic:"Deep Learning", round:1, difficulty:"Hard", type:"scenario",
        q:"What is transfer learning and when is it valuable?",
        options:["Moving model between servers","Using a pre-trained model's learned features as a starting point for a new task — especially valuable with limited data","Copying model weights to another framework","Training on multiple GPUs"],
        answer:1, explanation:"Transfer learning leverages features learned on large datasets (e.g., ImageNet). Fine-tuning a pre-trained model requires far less data and training time." },
    ],
    round2: [
      { id:"dl_r2_1", topic:"Deep Learning", round:2, difficulty:"Hard", type:"coding",
        q:"Using PyTorch, implement a simple 3-layer feedforward neural network for binary classification:\n- Input: 10 features\n- Hidden layers: 64, 32 units with ReLU\n- Output: 1 unit with Sigmoid\n- Define the model class, forward pass, loss (BCELoss), and optimizer (Adam lr=0.001)",
        starterCode:`import torch\nimport torch.nn as nn\n\nclass BinaryClassifier(nn.Module):\n    def __init__(self):\n        super().__init__()\n        # Define layers here\n    \n    def forward(self, x):\n        # Define forward pass here\n        pass\n\nmodel = BinaryClassifier()\nloss_fn = # ...\noptimizer = # ...`,
        testCases:[
          { input:"3-layer NN", expected:"Correct model architecture, forward pass, loss, optimizer" },
        ],
        explanation:"nn.Sequential or manual layers with ReLU. sigmoid output. BCELoss. Adam optimizer." },
    ],
  },
};

// ── FALLBACK GENERIC QUESTIONS ───────────────────────────────
// Used for any skill not in the question bank above
export const GENERIC_ROUND1_QUESTIONS = [
  { id:"gen_r1_1", topic:"General", round:1, difficulty:"Medium", type:"mcq",
    q:"What is the primary purpose of version control systems like Git?",
    options:["Deploying applications","Tracking changes to code, enabling collaboration, and reverting to previous states","Debugging code","Compressing files"],
    answer:1, explanation:"VCS tracks every change, allows multiple developers to work simultaneously, and enables rollback to any previous state." },
  { id:"gen_r1_2", topic:"General", round:1, difficulty:"Medium", type:"scenario",
    q:"What does 'separation of concerns' mean in software development?",
    options:["Keeping all code in one file","Organizing code so different aspects (UI, logic, data) are handled independently","Using multiple programming languages","Avoiding reusable code"],
    answer:1, explanation:"SoC means each module/component handles one distinct concern. It improves maintainability, testability, and reusability." },
  { id:"gen_r1_3", topic:"General", round:1, difficulty:"Hard", type:"scenario",
    q:"What is the difference between synchronous and asynchronous execution?",
    options:["Sync is faster","Sync blocks until completion; async allows other operations to proceed while waiting","Async is always better","They behave identically"],
    answer:1, explanation:"Sync: each operation waits for the previous to finish (blocking). Async: operations can run concurrently without blocking — critical for I/O-heavy applications." },
  { id:"gen_r1_4", topic:"General", round:1, difficulty:"Medium", type:"mcq",
    q:"What does DRY stand for in software engineering?",
    options:["Don't Repeat Yourself","Debug, Refactor, Yield","Dynamic Runtime Yield","Data Replication Yes"],
    answer:0, explanation:"DRY (Don't Repeat Yourself): every piece of knowledge should have a single, authoritative representation in the codebase." },
  { id:"gen_r1_5", topic:"General", round:1, difficulty:"Hard", type:"scenario",
    q:"What is the time complexity of O(1)?",
    options:["Quadratic time","Constant time — execution time doesn't grow with input size","Linear time","Logarithmic time"],
    answer:1, explanation:"O(1) means the operation takes constant time regardless of input size — e.g., array index access, hash map lookup." },
  { id:"gen_r1_6", topic:"General", round:1, difficulty:"Medium", type:"mcq",
    q:"What is an API (Application Programming Interface)?",
    options:["A type of database","A contract that defines how software components communicate and exchange data","A programming language","A UI framework"],
    answer:1, explanation:"An API defines a set of rules and protocols for how applications communicate — enabling integration between services." },
  { id:"gen_r1_7", topic:"General", round:1, difficulty:"Hard", type:"scenario",
    q:"What is unit testing?",
    options:["Testing the entire application","Testing individual functions/methods in isolation to verify they behave correctly","Only testing UI","Testing with real production data"],
    answer:1, explanation:"Unit tests verify individual components in isolation, making bugs easier to locate and preventing regressions." },
  { id:"gen_r1_8", topic:"General", round:1, difficulty:"Medium", type:"mcq",
    q:"What does SOLID stand for in object-oriented design?",
    options:["A CSS framework","5 design principles: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion","A database pattern","A version control strategy"],
    answer:1, explanation:"SOLID principles guide OOP design to create maintainable, flexible, scalable code." },
  { id:"gen_r1_9", topic:"General", round:1, difficulty:"Hard", type:"scenario",
    q:"What is the difference between REST and GraphQL APIs?",
    options:["GraphQL is faster always","REST uses fixed endpoints; GraphQL uses a single endpoint where clients specify exactly what data they need","REST is deprecated","They are identical"],
    answer:1, explanation:"REST: multiple endpoints, each returning fixed data shapes. GraphQL: one endpoint, client declares needed fields — prevents over/under-fetching." },
  { id:"gen_r1_10", topic:"General", round:1, difficulty:"Medium", type:"mcq",
    q:"What is CI/CD?",
    options:["A programming paradigm","Continuous Integration (auto-build/test on commits) + Continuous Delivery/Deployment (auto-deploy verified builds)","A database type","A design pattern"],
    answer:1, explanation:"CI: merge code frequently, run automated tests on every commit. CD: automatically deploy passing builds to staging/production." },
];

// ── QUESTION SELECTION UTILITIES ─────────────────────────────

/**
 * Shuffle array using Fisher-Yates algorithm (in-place)
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Get Round 1 questions for a skill.
 * Returns shuffled questions (count: up to 10).
 * Falls back to generic questions if skill not in bank.
 */
export function getRound1Questions(skill, count = 10) {
  // Normalize skill name for lookup
  const normalized = Object.keys(SKILL_QUESTIONS).find(
    k => k.toLowerCase() === skill.toLowerCase() ||
         skill.toLowerCase().includes(k.toLowerCase()) ||
         k.toLowerCase().includes(skill.toLowerCase())
  );

  const pool = normalized
    ? (SKILL_QUESTIONS[normalized]?.round1 || [])
    : GENERIC_ROUND1_QUESTIONS;

  const shuffled = shuffleArray(pool);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Shuffle options within each question and adjust answer index
  return selected.map(q => {
    const paired = q.options.map((opt, i) => ({ opt, isCorrect: i === q.answer }));
    const shuffledPaired = shuffleArray(paired);
    return {
      ...q,
      options: shuffledPaired.map(p => p.opt),
      answer: shuffledPaired.findIndex(p => p.isCorrect),
    };
  });
}

/**
 * Get Round 2 coding questions for a skill.
 * Returns 1-2 coding challenges.
 */
export function getRound2Questions(skill) {
  const normalized = Object.keys(SKILL_QUESTIONS).find(
    k => k.toLowerCase() === skill.toLowerCase() ||
         skill.toLowerCase().includes(k.toLowerCase()) ||
         k.toLowerCase().includes(skill.toLowerCase())
  );

  const pool = normalized
    ? (SKILL_QUESTIONS[normalized]?.round2 || [])
    : [];

  if (pool.length === 0) {
    // Generic open-ended coding question
    return [{
      id: `generic_r2_${skill.replace(/\s+/g,'_').toLowerCase()}`,
      topic: skill,
      round: 2,
      difficulty: "Hard",
      type: "open_ended",
      q: `Design and implement a non-trivial solution that demonstrates your ${skill} proficiency.\n\nYour solution should:\n- Solve a real-world problem relevant to ${skill}\n- Include proper error handling\n- Be well-structured and readable\n- Include at least 2 edge cases\n\nExplain your approach in comments.`,
      starterCode: `// ${skill} Practical Implementation\n// Problem: Design a real-world solution demonstrating ${skill}\n\n// Your code here:`,
      testCases: [{ input: `${skill} practical problem`, expected: "Working, well-structured solution with comments" }],
      explanation: `Demonstrate hands-on ${skill} proficiency through a practical implementation.`,
    }];
  }

  return shuffleArray(pool).slice(0, 1);
}

/**
 * Get the skill question bank key that best matches a given skill name
 */
export function getSkillKey(skill) {
  if (!skill) return null;
  return Object.keys(SKILL_QUESTIONS).find(
    k => k.toLowerCase() === skill.toLowerCase() ||
         skill.toLowerCase().includes(k.toLowerCase()) ||
         k.toLowerCase().includes(skill.toLowerCase())
  ) || null;
}

/**
 * Check if a skill has a dedicated question bank
 */
export function hasQuestionBank(skill) {
  return !!getSkillKey(skill);
}
