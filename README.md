# Meteor-TSP
Meteor App for finding optimal route, using Simulated Annealing Travelling Salesman Problem.



### 1. User Interface:
     A sample of 5 locations in zig-zag format is loaded on launch. The leader-board must have at least 1 location at any time, and at least 2 locations to submit request, though the algorithm works best from at least 4 locations.  The first location is start point and the last is destination/back to start. Algorithm computes optimal route only with mid points, covering all at least one, i.e locations (1..n) exclusive. You can dynamically swap (drag and drop) locations in the board.

     Maintaining at least 1 location in leader-board subliminally optimizes the app. This app requires to store Sequence IDs of fields inserting into mongoDB, for shuffling locations during algorithm execution. Adding Sequential IDs to MongoDB is expensive, and so is updating others based on this, for each change. This has been bypassed by using zeroth element from the board.

    Location-board allows 'Drag and Drop', auto sort and delete functionalities. All new locations are stored in mongoDB with formatted address acquired from google maps API, latitude, longitude and a sequence Id. It also throws alerts for adding invalid locations (Cross checked with Google maps API), deleting all locations in board, or computing route with fewer than 2 locations. 

### 2. Using Test Data:

     Test data consists of 25 most populated US Cities. The number of possible routes between these 25 cities is 25! or 1.5511210043330985984 × 10^25 or 15 million billion billion. Finding an optimal route between these cities is an NP-hard problem. Simulated Annealing is one of the best known algorithms for solving Travelling Salesman problem, and it is also helpful here in finding possibly optimal route in considerably less number of iterations (About 10 million for given problem).
     
### 3..... (Add more)

### TODOs:
- Fix screen freeze on computing route. 
- Map should show up route changes in real-time.
- Add more test cases.
- Display Metrics table.

### Packages Used:

- Iron - Router
- Http
- Ruxaba Sortable
- dburles:google-maps
- Velocity - Mocha for testing, with Chai assertion library.
- juliancwirko:s-alert
- juliancwirko:s-alert-stackslide
- meteor: reactiveVar for invoking functions after async callback.
- CollectionFS filesystem.
- NProgress for loading spinner.
