require([
    'jquery',
    'knockout',
    'views/page-view',
    'views/graph-manager/graph',
    'views/graph-manager/branch-list',
    'views/graph-manager/node-list',
    'views/graph-manager/permissions-list',
    'views/graph-manager/node-form',
    'views/graph-manager/permissions-form',
    'views/graph-manager/branch-info',
    'bootstrap-nifty'
], function($, ko, PageView, GraphView, BranchListView, NodeListView, PermissionsListView, NodeFormView, PermissionsFormView, BranchInfoView) {
    var graphData = JSON.parse($('#graph-data').val());
    var branches = JSON.parse($('#branches').val());
    var datatypes = JSON.parse($('#datatypes').val());
    var datatypelookup = {}
    _.each(datatypes, function(datatype){
        datatypelookup[datatype.datatype] = datatype.iconclass;
    }, this)

    graphData.nodes.forEach(function (node) {
        node.selected = ko.observable(false);
        node.filtered = ko.observable(false);
        node.editing = ko.observable(false);
        node.name = ko.observable(node.name);
        node.iconclass = datatypelookup[node.datatype];
    });

    branches.forEach(function(branch){
        branch.selected = ko.observable(false);
        branch.filtered = ko.observable(false);
    }, this);

    var viewModel = {
        nodes: ko.observableArray(graphData.nodes),
        edges: ko.observableArray(graphData.edges),
        branches: ko.observableArray(branches)
    };

    viewModel.onNodeStateChange = ko.computed(function() {
        var editNode = _.find(viewModel.nodes(), function(node){
            return node.editing();
        }, this)
        var selectedNodes = _.filter(viewModel.nodes(), function(node){
            return node.selected();
        }, this)
        return {editNode: editNode, selectedNodes: selectedNodes}
    });

    viewModel.graph = new GraphView({
        el: $('#graph'),
        nodes: viewModel.nodes,
        edges: viewModel.edges
    });

    viewModel.onNodeStateChange.subscribe(function () {
        viewModel.graph.render();
    });

    viewModel.branchList = new BranchListView({
        el: $('#branch-library'),
        branches: viewModel.branches
    });

    viewModel.nodeList = new NodeListView({
        el: $('#node-listing'),
        nodes: viewModel.nodes
    });

    viewModel.permissionsList = new PermissionsListView({
        el: $('#node-permissions')
    });

    viewModel.nodeForm = new NodeFormView({
        el: $('#nodeCrud')
    });

    viewModel.permissionsForm = new PermissionsFormView({
        el: $('#permissions-panel')
    });

    viewModel.branchInfo = new BranchInfoView({
        el: $('#branch-panel')
    });

    new PageView({
        viewModel: viewModel
    });

    var resize = function(){
        $('#graph').height($(window).height()-200);
        $('svg').height($(window).height()-200);
        $('.tab-content').height($(window).height()-259);
        $('.grid-container').height($(window).height()-360);
    }

    $( window ).resize(resize);

    resize();
});
