let $;
let DataTable;

export function setJQuery(jq) {
  $ = jq;
  DataTable = jq.fn.dataTable;
};

export default class Group {
    private static version = '0.0.1';

    private static classes = {

    }

    private static defaults = {

    }

    public classes;
	public dom;
	public c;
	public s;
    
    constructor(criteriaSettings, opts) {
        // Check that the required version of DataTables is included
        if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
            throw new Error('SearchPane requires DataTables 1.10 or newer');
        }

        let table = new DataTable.Api(criteriaSettings);

		this.classes = $.extend(true, {}, Criteria.classes);

		// Get options from user
        this.c = $.extend(true, {}, Criteria.defaults, opts);
        
        this.s = {
            dt: table,
            criteria: [],
            logic: undefined,
            subgroups: [],
        }

        this.dom = {
            container: $('<div/>').addClass(this.classes.group),
            add: $('<div/>').addClass(this.classes.add),
            logic: $('<button/>').addClass(this.classes.logic)
        }

        this.setup();

    }

    public getNode(){
        return this.dom.container;
    }

    public search(rowData){
        if(this.s.logic === "AND"){
            this.andSearch(rowData);
        }
        else if(this.s.logic === "OR"){
            this.orSearch(rowData);
        }
    }

    private andSearch(rowData){
        for(let crit of this.s.criteria){
            if(!crit.exec(rowData)){
                return false;
            }
        }
        for(let gro of this.s.subgroups){
            if(!gro.search(rowData)){
                return false;
            }
        }
        return true;
    }

    private orSearch(rowData){
        for(let crit of this.s.criteria){
            if($(crit.dom.condition).children("option:selected").val().comparator(rowData)){
                return true;
            }
        }
        for(let gro of this.s.subgroups){
            if(gro.search(rowData)){
                return true;
            }
        }
        return false;
    }

    private setup() {
        $(this.dom.add).on('click', () => {
            this.addCriteria();
        })

        $(this.dom.container).append(this.dom.add);
    }

    private addCriteria(){
        let crit = new Criteria(undefined, undefined);
        $(this.dom.container).append(crit.getNode());
    }
}