@extends('admin.layouts.app')

@section('title', 'Content Footer')

@section('content')
    <div class="app-content">
        <div class="container">
            <div class="card border-0">
                <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3 bg-white">
                    <h5 class="mb-3 my-md-0 fw-bold">Content Footer</h5>
                    <div class="d-flex align-items-center gap-2">
                        {{-- <a href="{{ route('admin.content-footer.create') }}" class="btn btn-subtle-primary d-flex align-items-center gap-2">
              <i class="bi bi-plus"></i>
              <span>Tambah</span>
            </a> --}}
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th style="width: 15%;">Actions</th>
                                    <th style="width: 5%;">Id</th>
                                    <th style="width: 20%;">Content</th>
                                    <th style="width: 15%;">Url</th>
                                    <th style="width: 10%;">Icon</th>
                                    <th style="width: 15%;">Image</th>
                                    <th style="width: 10%;">Type</th>
                                    <th style="width: 10%;">Letak</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($data as $root)
                                    @if ($root->parent == null && $root->children->count() > 0)
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center gap-1">
                                                    <button class="btn btn-subtle-warning btn-sm"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#content-footer-update"
                                                        data-id="{{ $root->id }}">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button type="button"
                                                        onclick="deleteContentFooter({{ $root->id }})"
                                                        class="btn btn-subtle-danger btn-sm">
                                                        <i class="bi bi-trash"></i></button>
                                                    <button class="btn btn-subtle-success btn-sm"
                                                        data-id="{{ $root->id }}" data-bs-toggle="modal"
                                                        data-bs-target="#content-footer-create">
                                                        <i class="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{{ $root->id }}</td>
                                            <td>{{ $root->content }}</td>
                                            <td>{{ Str::limit($root->url, 20) }}</td>
                                            <td>{{ Str::limit($root->icon, 20) }}</td>
                                            <td>{{ Str::limit($root->image, 20) }}</td>
                                            <td>
                                                <span class="badge bg-danger">Title</span>
                                            </td>
                                            <td>
                                                <span
                                                    class="badge bg-warning text-dark">{{ $root->tab_content == 1 ? 'Kiri' : ($root->tab_content == 2 ? 'Tengah' : ($root->tab_content == 3 ? 'Kanan' : ($root->tab_content == 4 ? 'Bawah' : ''))) }}</span>
                                            </td>
                                        </tr>

                                        @foreach ($root['children'] as $child)
                                            <tr>
                                                <td>
                                                    <div class="d-flex align-items-center gap-1">
                                                        <button class="btn btn-subtle-warning btn-sm"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#content-footer-update"
                                                            data-id="{{ $child->id }}">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                        <button type="button"
                                                            onclick="deleteContentFooter({{ $child->id }})"
                                                            class="btn btn-subtle-danger btn-sm">
                                                            <i class="bi bi-trash"></i></button>
                                                    </div>
                                                </td>
                                                <td class="text-muted">
                                                    <div class="ps-0 text-nowrap">
                                                        <i class="bi bi-arrow-return-right"></i>
                                                        <span>{{ $child->id }}</span>
                                                    </div>
                                                </td>
                                                <td class="text-muted">{{ $child->content }}</td>
                                                <td class="text-muted">{{ Str::limit($child->url, 20) }}</td>
                                                <td class="text-muted">{{ Str::limit($child->icon, 20) }}</td>
                                                <td class="text-muted">{{ Str::limit($child->image, 20) }}</td>
                                                <td class="text-muted">
                                                    <span class="badge bg-success">Content</span>
                                                </td>
                                            </tr>
                                        @endforeach
                                    @endif
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
    <div class="modal fade" id="content-footer-create" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3">
                        <h5 class="mb-3 my-md-0 fw-bold">Create Content Footer</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <form class="row g-3" action="{{ route('admin.content-footer.store') }}" method="post"
                        enctype="multipart/form-data" id="form-create">
                        @csrf
                        <div class="col-md-12 mb-2">
                            <label for="content" class="form-label">Content <span class="text-danger" style="font-size: 10px">*</span></label>
                            <textarea value="{{ old('content') }}" name="content" type="text" class="form-control" id="content"
                                placeholder="Input Judul/Isi Content ..."></textarea>
                        </div>
                        <input type="hidden" name="parent_id">
                        <div class="col-md-12 mb-2">
                            <label for="url" class="form-label">Url</label>
                            <input value="{{ old('url') }}" name="url" type="text" class="form-control"
                                id="url" placeholder="Input Url ...">
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="icon" class="form-label">Icon Class Bootstrap</label>
                            <input value="{{ old('icon') }}" name="icon" type="text" class="form-control"
                                id="icon" placeholder="bi bi-pencil ...">
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="image" class="form-label">Image</label>
                            <input name="image" class="form-control" type="file"
                                accept="image/jpeg, image/png, image/jpg" id="image">
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
    <div class="modal fade" id="content-footer-update" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3">
                        <h5 class="mb-3 my-md-0 fw-bold">Update Content Footer</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <form class="row g-3" action="{{ route('admin.content-footer.update') }}" method="post"
                        enctype="multipart/form-data" id="form-update">
                        @csrf
                        <div class="col-md-12 mb-2">
                            <label for="content" class="form-label">Content</label>
                            <textarea value="{{ old('content') }}" name="update-content" type="text" class="form-control" id="update-content"
                                placeholder="Input Judul/Isi Content ..."></textarea>
                        </div>
                        <input type="hidden" name="update-parent_id">
                        <input type="hidden" name="update-idx_content">
                        <div class="col-md-12 mb-2">
                            <label for="url" class="form-label">Url</label>
                            <input value="{{ old('url') }}" name="update-url" type="text" class="form-control"
                                id="update-url" placeholder="Input Url ...">
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="icon" class="form-label">Icon Class Bootstrap</label>
                            <input value="{{ old('icon') }}" name="update-icon" type="text" class="form-control"
                                id="update-icon" placeholder="bi bi-pencil ...">
                        </div>
                        <div class="col-md-12 mb-2">
                            <label for="image" class="form-label">Image <span class="text-danger" style="font-size: 10px">* Tidak perlu upload
                                    jika image tidak ada perubahan</span></label>
                            <input name="update-image" class="form-control" type="file"
                                accept="image/jpeg, image/png, image/jpg" id="update-image">
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
            function deleteContentFooter(id) {
                Swal.fire({
                    title: 'Delete Content Footer',
                    text: 'Apakah Anda yakin ingin menghapus data ini?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya, Hapus Saja!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: "{{ route('admin.content-footer.destroy') }}",
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
                fd.append('parent', $('[name="parent_id"]').val());
                fd.append('content', $('[name="content"]').val());
                fd.append('url', $('[name="url"]').val());
                fd.append('icon', $('[name="icon"]').val());
                if (!!$('[name="image"]')[0].files[0]) {
                    fd.append('image', $('[name="image"]')[0].files[0]);
                }
                // Set Data
                $.ajax({
                    url: $('#form-create').attr('action'),
                    type: $('#form-create').attr('method'),
                    data: fd,
                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                    processData: false, // NEEDED, DON'T OMIT THIS
                    success: function(response) {
                        // console.log(response);
                        // Close Modal
                        $('#content-footer-create').modal('toggle');
                        // Set Allert
                        toastr.success(response['message']);
                        // Reload Page
                        window.location.reload();
                    },
                    error: function(xhr) {
                        const response = JSON.parse(xhr.responseText);
                        // console.log(response);
                        $('[name="content"]').removeClass('is-invalid');
                        $('[name="url"]').removeClass('is-invalid');
                        $('[name="icon"]').removeClass('is-invalid');
                        $('[name="image"]').removeClass('is-invalid');
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
                fd.append('parent', $('[name="update-parent_id"]').val());
                fd.append('content', $('[name="update-content"]').val());
                fd.append('url', $('[name="update-url"]').val());
                fd.append('icon', $('[name="update-icon"]').val());
                fd.append('idx', $('[name="update-idx_content"]').val());
                if (!!$('[name="update-image"]')[0].files[0]) {
                    fd.append('image', $('[name="update-image"]')[0].files[0]);
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
                        $('#content-footer-update').modal('toggle');
                        // Set Allert
                        toastr.success(response['message']);
                        // Reload Page
                        window.location.reload();
                    },
                    error: function(xhr) {
                        const response = JSON.parse(xhr.responseText);
                        // console.log(response);
                        $('[name="update-content"]').removeClass('is-invalid');
                        $('[name="update-url"]').removeClass('is-invalid');
                        $('[name="update-icon"]').removeClass('is-invalid');
                        $('[name="update-image"]').removeClass('is-invalid');
                        if(response.errors){
                            // console.log(Object.keys(response.errors));
                            Object.keys(response.errors).forEach(element => {
                                $('[name="update-' + element + '"]').addClass('is-invalid');
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
                $('#content-footer-create').on('show.bs.modal', function(event) {
                    var attr = $(event.relatedTarget);
                    var id = attr.data('id');
                    $('[name="parent_id"]').val(id);
                });
                $('#content-footer-update').on('show.bs.modal', function(event) {
                    var attr = $(event.relatedTarget);
                    var id = attr.data('id');
                    // console.log(id);
                    $('[name="update-parent_id"]').val(id);
                    // Set Data
                    let url = `{{ route("admin.content-footer.find", ":id") }}`;
                    url = url.replace(':id', id);
                    $.ajax({
                        url: url,
                        type: 'get',
                        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                        processData: false, // NEEDED, DON'T OMIT THIS
                        success: function(response) {
                            $('[name="update-content"]').val(response.content);
                            $('[name="update-url"]').val(response.url);
                            $('[name="update-icon"]').val(response.icon);
                            $('[name="update-idx_content"]').val(response.idx_content);
                            toastr.success('Data Ditemukan!');
                        },
                        error: function(xhr) {
                            const response = JSON.parse(xhr.responseText);
                            // console.log(response);
                            toastr.error(response.message);
                        }
                    });
                })
            });
        </script>
    @endpush
@endsection
