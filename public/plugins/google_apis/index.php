<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script type="text/javascript" src="https://code.jquery.com/jquery-1.10.1.min.js"></script>

<style type="text/css">
    .count {
        font-size: 50px;
    }

    .open-link:hover {
        background: #ddd;
        cursor: pointer;
    }

    body {
        background: aliceblue;
    }

    .header {
        background: #2285ef;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
    }

    .page-content {
        margin-top: 20px;
    }

    .site-name {
        cursor: pointer;
        font-size: 25px;
    }

    .site-list {
        display: none;
        position: absolute;
        padding: 30px;
        background: #ddd;
        top: 50px;
        z-index: 100;
        background: #000;
        padding: 0px;
    }

    table {
        background: #fff;
        -webkit-box-shadow: 0px 0px 5px -1px rgba(158, 155, 158, 1);
        -moz-box-shadow: 0px 0px 5px -1px rgba(158, 155, 158, 1);
        box-shadow: 0px 0px 5px -1px rgba(158, 155, 158, 1);
        padding-bottom: 15px;
    }

    h1,
    p {
        text-align: center;
    }

    .progress {
        display: flex;
    }

    .progress-cotent {
        position: absolute;
        text-align: center;
        width: inherit;
        padding-top: 5px;
    }

    .count {
        font-size: 86px;
    }

    .progress-bar-success,
    .label-success:before {
        background-color: #50b432;
    }

    .progress-bar-warning,
    .label-warning:before {
        background-color: #ed561b;
    }

    .progress-bar-danger,
    .label-danger:before {
        background-color: #058dc7;
    }

    .label-success,
    .label-warning,
    .label-danger {
        background: transparent;
        color: #444;
        display: inline-block;
        font-size: 1em;
        line-height: 1.1em;
        font-weight: bold;
        font-family: arial;
    }

    .progress-label .label:before {
        content: '';
        width: 10px;
        height: 10px;
        float: left;
        margin-right: 3px;
    }

    .progress-bar-danger span,
    .label-success span+span,
    .label-warning span+span {}

    .progress-label {
        text-transform: uppercase;
        font-size: 0.8em;
        font-weight: bold;
        margin: 5px 0 8px
    }

    .progress {
        height: 35px;
    }

    .progress-bar {
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .table {
        border-radius: 5px 5px 0 0;
        box-shadow: inherit;
        -webkit-box-shadow: inherit;
        border-top: 2px solid #666
    }

    .table th {
        background: #fff;
        padding: 10px 8px;
        height: auto;
        font-size: 0.95em;
    }

    .table tr:nth-child(odd) td:nth-child(even) {
        background: rgba(0, 0, 0, 0.03);
        text-align: center;
    }

    .table tr:nth-child(even) td {
        background: rgba(0, 0, 0, 0.02)
    }

    .table tr:nth-child(even) td:nth-child(even) {
        background: rgba(0, 0, 0, 0.06);
        text-align: center;
    }

    .table>tbody>tr>td {
        padding: 7px 8px;
        color: #444;
        font-size: 0.95em;
    }

    .table td {
        width: 90%
    }

    .table td:nth-child(even) {
        width: 10%;
    }

    .col-md-3 .table td {
        width: 64%
    }

    .col-md-3 .table td:nth-child(even) {
        width: 36%;
    }

    @media (max-width:768px) {

        .col-md-9,
        .col-md-3 {
            padding: 0
        }
    }

    @media (max-width: 991px) {
        .col-md-3.pull-right {
            float: none !important;
        }
    }
</style>

<div class="container page-content">
    <div class="row">
        <div class="col-md-12">
            <table class="table table-bordered" id="result-pages">
                <thead>
                    <tr>
                        <th width="40%">Top Active Pages</th>
                        <th>Views</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <!-- <div class="col-md-4">
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <th>Right Now</th>
                    </tr>
                    <tr>
                        <td>
                            <h1>
                                <div class="count" id="active-users">
                                    0
                                </div>
                            </h1>
                            <p>Active Users on Site</p>
                            <br>
                            <div>
                                <div class="progress-label" style="display:flex;">
                                    <div class="label label-warning">
                                        <span>Mobile</span>
                                    </div>
                                    <div class="label label-success">
                                        <span>Desktop</span>
                                    </div>
                                    <div class="label label-danger">
                                        <span>Tablet</span>
                                    </div>
                                </div>
                                <div id="devices">

                                </div>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-bordered" id="countries-sources">
                <thead>
                    <tr>
                        <th>Country</th>
                        <th>Users</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>






        </div> -->
    </div>
</div>

<script type="text/javascript">
    function getDeviceColor(device) {
        if (device == 'mobile') {
            return 'warning';
        }
        if (device == 'desktop') {
            return 'success';
        }
        if (device == 'tablet') {
            return 'danger';
        }
    }

    function getData() {
        $.ajax({
            url: '/plugins/google_apis/autoload_data.php',
            type: 'get',
            success: function(res) {
                pages = country = devices = '';
                res = $.parseJSON(res);

                //active pages
                for (var i = 0; i < res['liveUsers'].length; i++) {
                    pages += '<tr class="open-link" data-link="https://google.com">';
                    pages += '<td>' + res['liveUsers'][i]['unifiedScreenName'] + '</td>';
                    pages += '<td>' + res['liveUsers'][i]['active_users'] + '</td>';
                }
                pages += '</tr>';
                $("#result-pages tbody").html(pages);

                //devices
                // total_users = res['totalUsers'].length;
                // $("#active-users").html(total_users);
                // devices += '<div class="progress" style="width:100%!important">';
                // for (var i = 0; i < res['device'].length; i++) {
                //     percent = (res['device'][i]['active_users'] / total_users) * 100;
                //     devices += '<div class="progress-bar progress-bar-' + getDeviceColor(res['device'][i]['deviceCategory']) + '" style="width:' + percent + '%">' + res['device'][i]['active_users'] + '</div>';
                // }
                // devices += '</div>';
                // $("#devices").html(devices);

            }
        });
    }
    getData();
    setInterval(function() {
        getData();
    }, 30000);
</script>