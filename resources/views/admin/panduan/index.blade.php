@extends('admin.layouts.app')

@section('title', 'Panduan')

@section('content')
    <div class="app-content">
        <div class="container">
            <div class="card border-0">
                <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3 bg-white">
                    <h5 class="mb-3 my-md-0 fw-bold">Panduan

                    </h5>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-subtle-success btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#panduan-create">
                            Tambah <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th style="width: 15%;">Actions</th>
                                    <th style="width: 10%;">Id</th>
                                    <th style="width: 25%;">Name File</th>
                                    <th style="width: 25%;">Deskripsi</th>
                                    <th style="width: 10%;">Type File</th>
                                    <th style="width: 15%;">File</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($data as $root)
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-1">
                                            <button class="btn btn-subtle-warning btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target="#panduan-update"
                                                data-id="{{ $root->id }}">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button type="button"
                                                onclick="deletePanduan({{ $root->id }})"
                                                class="btn btn-subtle-danger btn-sm">
                                                <i class="bi bi-trash"></i></button>
                                            {{-- <button class="btn btn-subtle-success btn-sm"
                                                data-id="{{ $root->id }}" data-bs-toggle="modal"
                                                data-bs-target="#panduan-create">
                                                <i class="bi bi-plus"></i>
                                            </button> --}}
                                        </div>
                                    </td>
                                    <td>{{ $root->id }}</td>
                                    <td>{{ $root->name_file }}</td>
                                    <td>{{ Str::limit($root->description, 20) }}</td>
                                    <td>{{ $root->typefile }}</td>
                                    <td>{{ Str::limit($root->asset_file, 20) }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>

                    {{ $data->links() }}
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Create -->
    <div class="modal fade" id="panduan-create" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3">
                        <h5 class="mb-3 my-md-0 fw-bold">Create File Panduan</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <form class="row g-3" action="{{ route('admin.panduan.store') }}" method="post"
                        enctype="multipart/form-data" id="form-create">
                        @csrf
                        <div class="col-md-12 mb-2">
                            <label for="nama_file" class="form-label">Nama File <span class="text-danger" style="font-size: 10px">*</span></label>
                            <textarea value="{{ old('nama_file') }}" name="nama_file" type="text" class="form-control" id="nama_file"
                                placeholder="Input Nama File ..."></textarea>
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="deskripsi" class="form-label">Deskripsi <span class="text-danger" style="font-size: 10px">*</span></label>
                            <textarea  value="{{ old('deskripsi') }}" name="deskripsi" type="text" class="form-control"
                            id="deskripsi" placeholder="Input Deskripsi File ..."></textarea>
                        </div>
                        <div class="col-md-12 mb-2">
                            <input type="hidden" name="type_file_nm" value="{{ old('type_file_nm') }}">
                            <label for="type_file" class="form-label">Tipe File <span class="text-danger" style="font-size: 10px">*</span></label>
                            <select name="type_file" class="form-select" aria-label="Default select example" placeholder="Pilih Tipe File" onchange="setTypeFile(this)"></select>
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="berkas" class="form-label">Upload Berkas <span class="text-danger" style="font-size: 10px">*</span></label>
                            <input name="berkas" class="form-control" type="file"
                                accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/msword, application/vnd.ms-powerpoint, text/plain" id="berkas">
                        </div>
                        <div class="col-md-12 mb-2 mt-4 d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Create <i class="bi bi-check"
                                    onclick=""></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Update -->
    <div class="modal fade" id="panduan-update" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3">
                        <h5 class="mb-3 my-md-0 fw-bold">Update File Panduan</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <form class="row g-3" action="{{ route('admin.panduan.update') }}" method="post"
                        enctype="multipart/form-data" id="form-update">
                        @csrf
                        <input type="hidden" name="update_id" value="{{ old('update_id') }}">
                        <div class="col-md-12 mb-2">
                            <label for="update_nama_file" class="form-label">Nama File</label>
                            <textarea value="{{ old('update_nama_file') }}" name="update_nama_file" type="text" class="form-control" id="update_nama_file"
                                placeholder="Input Nama File ..."></textarea>
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="update_deskripsi" class="form-label">Deskripsi</label>
                            <textarea  value="{{ old('update_deskripsi') }}" name="update_deskripsi" type="text" class="form-control"
                            id="update_deskripsi" placeholder="Input Deskripsi File ..."></textarea>
                        </div>
                        <div class="col-md-12 mb-2">
                            <input type="hidden" name="update_type_file_nm" value="{{ old('update_type_file_nm') }}">
                            <label for="update_type_file" class="form-label">Tipe File</label>
                            <select name="update_type_file" class="form-select" aria-label="Default select example" placeholder="Pilih Tipe File" onchange="setTypeFile(this)"></select>
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="update_berkas" class="form-label">Upload Berkas <span class="text-danger" style="font-size: 10px">* Tidak perlu upload jika berkas tidak ada perubahan</span></label>
                            <input name="update_berkas" class="form-control" type="file"
                                accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/msword, application/vnd.ms-powerpoint, text/plain" id="update_berkas">
                        </div>
                        <div class="col-md-12 mb-2 mt-4 d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Update <i class="bi bi-check"
                                    onclick=""></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    @push('scripts')
        <script>
            function setTypeFile(element) {
                console.log(element.value, element.name);
                var valtext = $('[name="' + element.name + '"] option:selected').text();
                $('[name="' + element.name + '_nm"]').val(valtext);
                // $('[name="berkas"]').attr('accept', 'application/'+valtext.toLowerCase());
                // console.log($('[name="berkas"]').attr('accept'));
            }
            function deletePanduan(id) {
                Swal.fire({
                    title: 'Delete File Panduan',
                    text: 'Apakah Anda yakin ingin menghapus data ini?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya, Hapus Saja!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: "{{ route('admin.panduan.destroy') }}",
                            type: "POST",
                            data: {
                                id: id,
                                _token: "{{ csrf_token() }}"
                            },
                            success: function(response) {
                                // console.log(response);
                                // Toast
                                toastr.success(response['message']);
                                // Reload Page
                                window.location.reload();
                            },
                            error: function(xhr) {
                                const response = JSON.parse(xhr.responseText);
                                toastr.error(response.message);
                            }
                        })
                    }
                })
            }

            $('#form-create').on('submit', function(e) {
                // Ben Gak Ketutup Modal.e / Ben Gak Kerefresh
                e.preventDefault();
                // Set Form Data
                var fd = new FormData();
                fd.append('_token', "{{ csrf_token() }}");
                fd.append('nama_file', $('[name="nama_file"]').val());
                fd.append('deskripsi', $('[name="deskripsi"]').val());
                fd.append('type_file_nm', $('[name="type_file_nm"]').val());
                fd.append('type_file', $('[name="type_file"]').val());
                if (!!$('[name="berkas"]')[0].files[0]) {
                    fd.append('berkas', $('[name="berkas"]')[0].files[0]);
                }
                // Set Data
                $.ajax({
                    url: $('#form-create').attr('action'),
                    type: $('#form-create').attr('method'),
                    data: fd,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    success: function(response) {
                        console.log(response);
                        // Close Modal
                        $('#panduan-create').modal('toggle');
                        // Set Allert
                        toastr.success(response['message']);
                        // Reload Page
                        window.location.reload();
                    },
                    error: function(xhr) {
                        const response = JSON.parse(xhr.responseText);
                        // console.log(response);
                        $('[name="nama_file"]').removeClass('is-invalid');
                        $('[name="deskripsi"]').removeClass('is-invalid');
                        $('[name="type_file_nm"]').removeClass('is-invalid');
                        $('[name="type_file"]').removeClass('is-invalid');
                        $('[name="berkas"]').removeClass('is-invalid');
                        if(response.errors){
                            // console.log(Object.keys(response.errors));
                            Object.keys(response.errors).forEach(element => {
                                $('[name="' + element + '"]').addClass('is-invalid');
                                response.errors[element].forEach(msg => {
                                    // Set Allert
                                    toastr.error(msg);
                                });
                            });
                        }
                    }
                });
            });

            $('#form-update').on('submit', function(e) {
                // Ben Gak Ketutup Modal.e / Ben Gak Kerefresh
                e.preventDefault();
                // Set Form Data
                var fd = new FormData();
                fd.append('_token', "{{ csrf_token() }}");
                fd.append('id', $('[name="update_id"]').val());
                fd.append('nama_file', $('[name="update_nama_file"]').val());
                fd.append('deskripsi', $('[name="update_deskripsi"]').val());
                fd.append('type_file_nm', $('[name="update_type_file_nm"]').val());
                fd.append('type_file', $('[name="update_type_file"]').val());
                if (!!$('[name="update_berkas"]')[0].files[0]) {
                    fd.append('berkas', $('[name="update_berkas"]')[0].files[0]);
                }
                // Set Data
                $.ajax({
                    url: $('#form-update').attr('action'),
                    type: $('#form-update').attr('method'),
                    data: fd,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    success: function(response) {
                        console.log(response);
                        // Close Modal
                        $('#panduan-update').modal('toggle');
                        // Set Allert
                        toastr.success(response['message']);
                        // Reload Page
                        window.location.reload();
                    },
                    error: function(xhr) {
                        const response = JSON.parse(xhr.responseText);
                        // console.log(response);
                        $('[name="update_nama_file"]').removeClass('is-invalid');
                        $('[name="update_deskripsi"]').removeClass('is-invalid');
                        $('[name="update_type_file_nm"]').removeClass('is-invalid');
                        $('[name="update_type_file"]').removeClass('is-invalid');
                        $('[name="update_berkas"]').removeClass('is-invalid');
                        if(response.errors){
                            // console.log(Object.keys(response.errors));
                            Object.keys(response.errors).forEach(element => {
                                $('[name="update_' + element + '"]').addClass('is-invalid');
                                response.errors[element].forEach(msg => {
                                    // Set Allert
                                    toastr.error(msg);
                                });
                            });
                        }
                    }
                });
            });

            $(function() {
                $('#panduan-create').on('show.bs.modal', function(event) {
                    var attr = $(event.relatedTarget);
                    $.ajax({
                        type: "get",
                        url: "{{ route('admin.panduan.data-dropdown') }}",
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        success: function(response) {
                            // console.log(response);
                            // Close Modal
                            var select = $('[name="type_file"]');
                            select.empty().append('<option value="">Pilih ...</option>');
                            response.forEach(element => {
                                select.append('<option value="' + element.id + '">' + element.text + '</option>');
                            });
                        },
                        error: function(xhr) {
                            const response = JSON.parse(xhr.responseText);
                            toastr.error(response.message);
                        }
                    });
                });
                $('#panduan-update').on('show.bs.modal', function(event) {
                    var attr = $(event.relatedTarget);
                    var id = attr.data('id');
                    $('[name="update_id"]').val(id);
                    // Set Data
                    let url = `{{ route("admin.panduan.find", ":id") }}`;
                    url = url.replace(':id', id);
                    var typefile_select = null;
                    $.ajax({
                        url: url,
                        type: 'get',
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        success: function(response) {
                            $('[name="update_nama_file"]').val(response.name_file);
                            $('[name="update_deskripsi"]').val(response.description);
                            $('[name="update_type_file_nm"]').val(response.typefile);
                            typefile_select = response.typefile;
                            toastr.success('Data Ditemukan!');
                        },
                        error: function(xhr) {
                            const response = JSON.parse(xhr.responseText);
                            // console.log(response);
                            toastr.error(response.message);
                        }
                    });
                    $.ajax({
                        type: "get",
                        url: "{{ route('admin.panduan.data-dropdown') }}",
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        success: function(response) {
                            // console.log(response);
                            // Close Modal
                            var select = $('[name="update_type_file"]');
                            if(typefile_select != null){
                                select.empty().append('<option>'+ typefile_select.toUpperCase() +'</option>');
                            }else{
                                select.empty().append('<option value="">Pilih ...</option>');                                
                            }
                            response.forEach(element => {
                                select.append('<option value="' + element.id + '">' + element.text + '</option>');
                            });
                        },
                        error: function(xhr) {
                            const response = JSON.parse(xhr.responseText);
                            toastr.error(response.message);
                        }
                    });
                })
            });
        </script>
    @endpush
@endsection
