{{-- Footer --}}
<div class="footer-gradient">
    <div class="footer-pattern">
        <div class="container pt-5 pb-2 position-relative">
            {{-- Content --}}
            <div class="row">
                <div class="footer-content-1">
                    @foreach ($appFooter['data'] as $item)
                        @if ($item->tab_content=='1')
                            <h4 class="mb-4 fw-bold">{{ $item->content }}</h4>
                            <div class="d-flex flex-column gap-3">
                                <a href="https://lapormbakwali.kedirikota.go.id/" target="_blank" rel="noopener noreferrer">
                                    <img src="{{ asset('assets/img/lmw-logo.png') }}" height="35" alt="">
                                </a>
                                <a href="https://www.lapor.go.id" target="_blank" rel="noopener noreferrer">
                                    <img src="{{ asset('assets/img/SP4N-Lapor.png') }}" height="35" alt="">
                                </a>
                                <h6 class="mt-3 mb-1">Survey Kepuasan</h6>
                                <div class="footer-content-surkep justify-content-center">
                                    <div id="surkep-4" class="footer-surkep-sangatpuas">
                                        <a href="javascript:void(0);" onclick="survey(4)" rel="noopener noreferrer">
                                            <img src="{{ asset('assets/img/survey-kepuasan/sangat-puas.png') }}" alt="">
                                        </a>
                                        <span class="text-center mt-1" style="font-size: 0.4rem">Sangat Puas</span>
                                        <span id="surkep-val-4" class="text-center" style="font-size: 0.6rem">{{ $appFooter['nilai_survey']['sp'] }}%</span>
                                    </div>
                                    <div id="surkep-3" class="footer-surkep-puas">
                                        <a href="javascript:void(0);" onclick="survey(3)" rel="noopener noreferrer">
                                            <img src="{{ asset('assets/img/survey-kepuasan/puas.png') }}" alt="">
                                        </a>
                                        <span class="text-center mt-1" style="font-size: 0.4rem">Puas</span>
                                        <span id="surkep-val-3" class="text-center" style="font-size: 0.6rem">{{ $appFooter['nilai_survey']['p'] }}%</span>
                                    </div>
                                    <div id="surkep-2" class="footer-surkep-cukuppuas">
                                        <a href="javascript:void(0);" onclick="survey(2)" rel="noopener noreferrer">
                                            <img src="{{ asset('assets/img/survey-kepuasan/cukup-puas.png') }}" alt="">
                                        </a>
                                        <span class="text-center mt-1" style="font-size: 0.4rem">Cukup Puas</span>
                                        <span id="surkep-val-2" class="text-center" style="font-size: 0.6rem">{{ $appFooter['nilai_survey']['cp'] }}%</span>
                                    </div>
                                    <div id="surkep-1" class="footer-surkep-kurangpuas">
                                        <a href="javascript:void(0);" onclick="survey(1)" rel="noopener noreferrer">
                                            <img src="{{ asset('assets/img/survey-kepuasan/tidak-puas.png') }}" alt="">
                                        </a>
                                        <span class="text-center mt-1" style="font-size: 0.4rem">Tidak Puas</span>
                                        <span id="surkep-val-1" class="text-center" style="font-size: 0.6rem">{{ $appFooter['nilai_survey']['tp'] }}%</span>
                                    </div>
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
                <div class="footer-content-2">
                    @foreach ($appFooter['data'] as $item)
                        @if ($item->tab_content=='2')
                            <div class="mb-4">
                                <h3 class="mb-3 fw-bold">{{ $item->content }}</h3>
                                <h5>{{ $setting->app_description }}</h5>
                            </div>
                            @foreach ($item->children as $items)
                                <p href="{{ $items->url }}" target="{{ $items->url==null?"":"_blank" }}" class="footer-a">{{ $items->content }}</p>
                            @endforeach
                        @endif
                    @endforeach
                </div>
                {{-- <div class="footer-content-3">
                    @foreach ($appFooter['data'] as $item)
                        @if ($item->tab_content=='3')
                            <h4 class="mb-4 fw-bold">{{ $item->content }}</h4>
                            @foreach ($item->children as $items)
                                <p href="{{ $items->url }}" target="{{ $items->url==null?"":"_blank" }}" class="footer-a">{{ $items->content }}</p>
                            @endforeach
                        @endif
                    @endforeach
                </div> --}}
                <div class="footer-content-4">
                    <h4 href="#" class="mb-4 fw-bold">Statistik Kunjungan</h4>
                    {{-- Total Visitor --}}
                    {{-- <div class="footer-div-parent">
                        <div class="footer-div-icon">
                            <i class="bi bi-people-fill"></i>
                        </div>
                        <div class="footer-div-title">
                            Total Visitor
                        </div>
                        <div class="footer-div-value">
                            {{ rand(1000,1100) }}
                        </div>
                        <div class="footer-div-on">
                            <div class="blink rounded-circle p-1 me-2" style="background-color: greenyellow"></div>
                            {{ rand(10,100) }} Online
                        </div>
                    </div> --}}
                    {{-- View Pages --}}
                    <div class="footer-div-parent">
                        <div class="footer-div-icon">
                            <i class="bi bi-bar-chart-fill"></i>
                        </div>
                        <div class="footer-div-title">
                            Total View
                        </div>
                        <div id="total-view" class="footer-div-value">
                            {{-- {{ $appTView<100?100+$appTView:$appTView }} --}}
                            0
                        </div>
                        <div id="live-view" class="footer-div-on">
                            <div class="blink rounded-circle p-1 me-2" style="background-color: greenyellow"></div>
                            {{-- {{ $appLiveView }} Online --}} 0 Online
                        </div>
                    </div>
                </div>
            </div>
            {{-- Kontak --}}
            <div class="d-flex gap-5 gap-sm-5 justify-content-center mt-3">
                @foreach ($appFooter['data'] as $item)
                    @if ($item->tab_content=='4')
                        @foreach ($item->children as $items)
                            <a href="{{ $items->url }}" target="{{ $items->url==null?"":"_blank" }}" class="footer-a text-light">
                                <i class="{{ $items->icon }}"></i>
                                <span class="d-none d-sm-inline">{{ $items->content }}</span>
                            </a>
                        @endforeach
                    @endif
                @endforeach
            </div>
            <hr>
            {{-- Copyright --}}
            <footer class="py-2">
                <footer class="text-center">&copy; {{ date('Y') }} {{ strtoupper($setting->app_name).' - '.$setting->app_description }}. Developed <cite title="Pemerintah Kota Kediri">by <a href="https://diskominfo.kedirikota.go.id" target="_blank" class="text-light" rel="noopener noreferrer">{{ $setting->company_name }}</a></cite></footer>
            </footer>
        </div>
    </div>
</div>
{{-- Script --}}
@push('script')
    <script>
        // Set Variable Global
        var Time_Interval = 1; // Menit
        var Live_Views = $('#live-view');
        var Total_Views = $('#total-view');
        // Survey Kepuasan
        function survey(id) {
            // console.log(id);
            // Set Data
            var data_json = {
                param_id: id,
                url: '/survey-kepuasan/',
                method: 'get',
            }
            fetchdata(data_json).then(function(data) {
                // console.log(data);
                if(data.code == 200) {
                    var content = $('#surkep-'+id);
                    content.addClass('active');
                    $('#surkep-val-4').text(data.data['sp']+"%");
                    $('#surkep-val-3').text(data.data['p']+"%");
                    $('#surkep-val-2').text(data.data['cp']+"%");
                    $('#surkep-val-1').text(data.data['tp']+"%");
                    Swal.fire("Terimakasih!", data.message, "success");
                }
                else if(data.code == 400 && data.status == 3) {
                    Swal.fire("Login!", data.message, "info");
                }
            });
        }
        // Fetch Data
        async function fetchdata(data) {
            var response = await fetch(data.url + (data.param_id ? data.param_id : ""), {
                ...data.headers,
                ...data.body,
                method: data.method.toUpperCase()
            });
            return await response.json();
        }
        // Komponen DidMount
        $(function() {
            // =============================================== //
            // Load Survey
            // Set Data
            var data_json = {
                url: '/load-survey-kepuasan/',
                method: 'get',
            }
            fetchdata(data_json).then(function(data) {
                // console.log(data);
                if(data.code == 200) {
                    var content = $('#surkep-'+data.data.skor);
                    content.addClass('active');
                }
            });
            // =============================================== //
            function getData() {
                $.ajax({
                    url: '/plugins/google_apis/autoload_data.php',
                    type: 'get',
                    success: function(res) {
                        var total_users = 0; var live_users = 0;
                        res = $.parseJSON(res);
                        // Live User
                        if(res['liveUsers']!=null){
                            for (var i = 0; i < res['liveUsers'].length; i++) {
                                live_users += Number(res['liveUsers'][i]['active_users']);
                            }
                            Live_Views.empty();
                            Live_Views.append(`
                                <div class="blink rounded-circle p-1 me-2" style="background-color: greenyellow"></div>
                                ${live_users} Online
                            `);
                        }
                        // Total User
                        if(res['totalUsers']!=null){
                            for (var i = 0; i < res['totalUsers'].length; i++) {
                                total_users += Number(res['totalUsers'][i]['totalUsers']);
                            }
                            Total_Views.empty();
                            Total_Views.append(`
                                ${total_users}
                            `);
                        }
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
            // =============================================== //
            // Set Interval
            setInterval(function() {
                getData();
                // // Set Empty Live_View
                // Live_Views.empty();
                // // Set Data
                // var data_json = {
                //     url: '/get-live-views',
                //     method: 'get',
                // }
                // fetchdata(data_json).then(function(data) {
                //     console.log(data);
                //     Live_Views.append(`
                //         <div class="blink rounded-circle p-1 me-2" style="background-color: greenyellow"></div>
                //                 ${data} Online
                //     `);
                // });
            }, (Time_Interval * 60 * 1000));
            // =============================================== //
        });
    </script>
@endpush