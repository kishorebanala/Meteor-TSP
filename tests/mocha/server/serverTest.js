if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Server initialization", function(){
      it("should insert locations into the database after server start", function(){
        chai.assert(Cities.find().count() > 0);
      });
    })
  });
}
