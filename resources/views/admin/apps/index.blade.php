@extends('admin.layouts.app')

@section('title', 'AppLink')

@section('content')
<div class="app-content">
  <div class="container">
    <div class="card border-0 shadow-sm">
      <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3 bg-white">
        <h5 class="mb-3 my-md-0 fw-bold">Apps</h5>
        <div class="d-flex align-items-center gap-2">
          <button type="button" data-bs-toggle="modal" data-bs-target="#appsModal"
            class="btn btn-subtle-primary d-flex align-items-center gap-2">
            <i class="bi bi-plus"></i>
            <span>Tambah</span>
          </button>
        </div>
      </div>
      <div class="card-body border-bottom">
        <form action="" method="get">
          <input type="hidden" name="is_sso" id="is_sso" value="{{ $filter['is_sso'] }}">
          <input type="hidden" name="app_from_id" id="app_from_id" value="{{ $filter['app_from_id'] }}">
          <input type="hidden" name="is_active" id="is_active" value="{{ $filter['is_active'] }}">
          <input type="hidden" name="show_all" id="show_all" value="{{ $filter['show_all'] }}">
          <div class="row align-items-center justify-content-between">
            <div class="col-12 col-md-5 mb-3 mb-md-0">
              <div class="input-group">
                <span class="input-group-text bg-secondary-subtle">
                  <i class="bi bi-search"></i>
                </span>
                <input type="search" name="search" value="{{ $filter['search'] }}" class="form-control bg-secondary-subtle"
                  placeholder="Search">
              </div>
            </div>
            <div class="col-12 col-md-1 mb-3 mb-md-0">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" @checked($filter['is_sso']) id="check-sso"
                  value="{{ $filter['is_sso'] }}" onchange="document.getElementById('is_sso').value = this.checked ? 1 : 0" @disabled($filter['show_all'])/>
                <label class="form-check-label" for="check-sso">Integrasi SSO</label>
              </div>
            </div>
            <div class="col-12 col-md-1 mb-3 mb-md-0">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" @checked($filter['app_from_id'] == 2)
                  id="check-app-from" value="{{ $filter['app_from_id'] == 2 ? true : false }}" onchange="document.getElementById('app_from_id').value = this.checked ? 2 : 1" @disabled($filter['show_all'])/>
                <label class="form-check-label" for="check-app-from">Aplikasi Pusat</label>
              </div>
            </div> 
            <div class="col-12 col-md-1 mb-3 mb-md-0">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" @checked($filter['is_active'])
                  id="check-active" value="{{ $filter['is_active'] }}" onchange="document.getElementById('is_active').value = this.checked ? 1 : 0" @disabled($filter['show_all'])/>
                <label class="form-check-label" for="check-active">Active App</label>
              </div>
            </div>
            <div class="col-12 col-md-1 mb-3 mb-md-0">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" @checked($filter['show_all'])
                  id="check-show-all" value="{{ $filter['show_all'] }}" onchange="disableCheckbox(this.checked)"/>
                <label class="form-check-label" for="check-show-all">Tampilkan Semua</label>
              </div>
            </div>
            <div class="col-12 col-md-3 mb-3 mb-md-0">
              <div class="d-flex align-items-center justify-content-end gap-2">
                <button type="submit" class="btn btn-subtle-primary d-flex align-items-center gap-2">
                  <i class="bi bi-search"></i>
                  <span>Search</span>
                </button>
              </div>
            </div>  
          </div>
        </form>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Actions</th>
                <th>ID</th>
                <th>Name</th>
                <th>Urusan</th>
                <th>Category</th>
                <th>Active</th>
                <th>SSO</th>
                <th>Asal Aplikasi</th>
              </tr>
            </thead>
            <tbody>
              @foreach ($data as $root)
              <tr @class(['table-danger'=> !$root->is_active])>
                <td>
                  <div class="d-flex align-items-center gap-1">
                    <button class="btn btn-subtle-warning btn-sm" data-edit="{{ $root->id }}" data-bs-toggle="modal"
                      data-bs-target="#appsModal">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-subtle-danger btn-sm" id="{{ $root->id }}" onclick="handleDestroy(this.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                    <button data-id="{{ $root->id }}" data-bs-toggle="modal" data-bs-target="#appsModal"
                      class="btn btn-subtle-success btn-sm">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </td>
                <td class="fw-bold">{{ $root->id }}</td>
                <td class="fw-bold">{{ strip_tags($root->name) }}</td>
                <td class="fw-bold">
                  <span class="badge bg-secondary">{{ $root->urusan->title }}</span>
                </td>
                <td class="fw-bold">
                  <span class="badge bg-secondary">{{ $root->category->title }}</span>
                </td>
                <td class="fw-bold">{{ $root->is_active ? 'Active' : 'Inactive' }}</td>
                <td class="fw-bold">{{ $root->is_sso ? 'SSO' : '-' }}</td>
                <td class="fw-bold">
                  <span class="badge @if ($root->app_from_id == 2) bg-primary @else bg-secondary @endif">{{ $root->app_from->name }}</span>
                </td>
              </tr>

              @foreach ($root['childrenRecursive'] as $child)
              <tr @class(['table-danger'=> !$child->is_active])>
                <td>
                  <div class="d-flex align-items-center gap-1">
                    <i class="bi bi-arrow-return-right"></i>
                    <button class="btn btn-subtle-warning btn-sm" data-edit="{{ $child->id }}" data-bs-toggle="modal"
                      data-bs-target="#appsModal">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-subtle-danger btn-sm" id="{{ $child->id }}" onclick="handleDestroy(this.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                    <button data-id="{{ $child->id }}" data-bs-toggle="modal" data-bs-target="#appsModal"
                      class="btn btn-subtle-success btn-sm">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </td>
                <td class="text-muted">
                  <div class="ps-0 text-nowrap">
                    <i class="bi bi-arrow-return-right"></i>
                    <span>{{ $child->id }}</span>
                  </div>
                </td>
                <td class="text-muted">{{ strip_tags($child->name) }}</td>
                <td class="text-muted">
                  <span class="badge bg-secondary">{{ $child->urusan->title ?? '-' }}</span>
                </td>
                <td class="text-muted">
                  <span class="badge bg-secondary">{{ $child->category->title }}</span>
                </td>
                <td class="fw-bold">{{ $child->is_active ? 'Active' : 'Inactive' }}</td>
                <td class="fw-bold">{{ $child->is_sso ? 'SSO' : '-' }}</td>
                <td class="fw-bold">
                  <span class="badge @if ($child->app_from_id == 2) bg-primary @else bg-secondary @endif">{{ $child->app_from->name }}</span>
                </td>
              </tr>

              @if (count($child['childrenRecursive']) > 0)
              @include('admin.apps.recursive', [
              'data' => $child['childrenRecursive'],
              ])
              @endif
              @endforeach
              @endforeach
            </tbody>
          </table>
        </div>

        @if (count($data) == 0)
        @include('component.empty-table')
        @endif

        @if ($data instanceof \Illuminate\Pagination\LengthAwarePaginator)
        {{ $data->onEachSide(0)->links() }}
        @endif
      </div>
    </div>
  </div>
</div>

@include('admin.apps.modal')

@push('scripts')
<script>
  const findById = async (id) => {
    const response = await fetch(`/admin/apps/${id}`);
    const result = await response.json();
    return result;
  }

  const disableCheckbox = (val) => {
    $('#show_all').val(val ? 1 : 0);
    $('#check-app-from').prop('disabled', val);
    $('#check-sso').prop('disabled', val);
    $('#check-active').prop('disabled', val);
  }

  const handleDestroy = (id) => {
    if (confirm('Are you sure ?')) {
      $.ajax({
        type: "DELETE",
        url: `/admin/apps/${id}`,
        data: {
          '_token': '{{ csrf_token() }}',
        },
        success: function (response) {
          toastr.success(response.message, 'Success');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
        error: function (request, status, error) {
          const errorResponse = JSON.parse(request.responseText);
          toastr.error(errorResponse.message, 'Ooops!');
          // console.log('getError', errorResponse);
        },
      });
    }
  }

  const handleSubmit = () => {
    let form = $('#appsModal').find('form');
    const paramId = form.find('[name="id"]').val();
    const isEdit = !!paramId;
    console.log('isEdit', isEdit);

    let fd = new FormData();
    fd.append('_token', '{{ csrf_token() }}');
    fd.append('urusan_id', form.find('[name="urusan_id"]').val());
    fd.append('category_id', form.find('[name="category_id"]').val());
    fd.append('parent', form.find('[name="code_parent"]').val());
    fd.append('name', form.find('[name="name"]').val());
    fd.append('alias', form.find('[name="alias"]').val());
    fd.append('description', form.find('[name="description"]').val());
    fd.append('url', form.find('[name="url"]').val());
    fd.append('icon', form.find('[name="icon"]').val());

    const imageFile = form.find('[name="image"]')[0].files[0];
    if (!!imageFile) {
      fd.append('image', imageFile);
    }
    
    fd.append('is_active', form.find('[name="is_active"]').prop('checked') == true ? 1 : 0);
    fd.append('is_sso', form.find('[name="is_sso"]').prop('checked') == true ? 1 : 0);
    fd.append('app_from_id', form.find('[name="app_from_id"]').prop('checked') == true ? 2 : 1);
    fd.append('_method', isEdit ? 'PUT' : 'POST');

    $.ajax({
      type: "POST",
      url: isEdit ? `/admin/apps/${paramId}` : `/admin/apps`,
      data: fd,
      processData: false,
      contentType: false,
      success: function (response) {
        // console.log('getResponse', response);
        toastr.success(response.message, 'Success.');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: function (request, status, error) {
        const errorResponse = JSON.parse(request.responseText);
        toastr.error(errorResponse.message, 'Ooops!');
        // console.log('getError', errorResponse);
      },
    });
  }

  $(function () {
    $('#appsModal').on('show.bs.modal', e => {
      let btn = $(e.relatedTarget);
      let id = btn.data('id');
      let childId = btn.data('edit');
      const isEdit = !!childId;

      console.log(`paramId: ${id}, childId: ${childId}`);
      
      $('#btnSubmit').html(isEdit ? "Update" : "Submit");

      if (isEdit) {
        console.log('edit data');
        findById(childId).then((data) => {
          console.log('selected', data);
          const form = $(this).find('form');
          form.find('[name="id"]').val(childId);
          form.find('[name="code_parent"]').val(data.parent?.id);
          form.find('[name="name_parent"]').val(data.parent?.name);
          form.find('[name="category_parent"]').val(data.parent?.category?.title);
          form.find('[name="urusan_id"]').val(data.urusan_id);
          form.find('[name="category_id"]').val(data.category_id);
          form.find('[name="parent"]').val(data.parent);
          form.find('[name="name"]').val(data.name);
          form.find('[name="alias"]').val(data.alias);
          form.find('[name="description"]').val(data.description);
          form.find('[name="url"]').val(data.url);
          form.find('[name="icon"]').val(data.icon);
          // form.find('[name="image"]').val(data.image);
          if (!!data.image) {
            form.find('#prev-image').html(`
              <div class="mt-2 d-flex gap-2">
                <small class="text-muted">Prev Image :</small>
                <img src="/storage/apps/${data.image}" width="50" class="img-fluid" />
              </div>
            `);
          }
          form.find('[name="is_active"]').attr('checked', data.is_active);
          form.find('[name="is_sso"]').attr('checked', data.is_sso);
          form.find('[name="app_from_id"]').attr('checked', data.app_from_id==2?true:false);
        });
      } else {
        console.log('create data');
        if (!!id) {
          findById(id).then((parent) => {
            const form = $(this).find('form');
            form.find('[name="code_parent"]').val(parent.id);
            form.find('[name="name_parent"]').val(parent.name);
            form.find('[name="category_parent"]').val(parent?.category?.title);
            console.log('parent', parent);
          });
        }
      }
    });

    $('#appsModal').on('hidden.bs.modal', e => {
      $(this).find('form').trigger('reset');
      const form = $(this).find('form');
      form.find('[name="id"]').val('');
      form.find('[name="code_parent"]').val('');
      $(this).find('#prev-image').empty();
    });
  });
</script>

<script>
  const fetchDataTable = async (search) => {
        const response = await fetch(`/admin/apps?search=${search}&is_json=${true}`);
        return await response.json();
      }

      const makeTableRow = (data) => {
        return `
          <tr class="fw-bold">
            <td>
              <button class="btn btn-subtle-success btn-sm" onclick="handleChangeParent(${data.id})">
                <i class="bi bi-hand-index-thumb"></i>
              </button>
            </td>
            <td>${data.id}</td>
            <td>${data.name}</td>
          </tr>
          ${data.children_recursive?.map(item => makeTableRecursive(item))}
        `;
      }

      const makeTableRecursive = (data) => {
        return `
          <tr class="small">
            <td>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-arrow-return-right"></i>
                <button class="btn btn-subtle-success btn-sm" onclick="handleChangeParent(${data.id})">
                  <i class="bi bi-hand-index-thumb"></i>
                </button>
              </div>
            </td>
            <td>${data.id}</td>
            <td>${data.name}</td>
          </tr>
        `;
      }

      const handleChangeParent = async (parent) => {
        const id = $('#chooseParentModal').find('[name="id"]').val();

        const response = await fetch(`/admin/apps/${id}/change-parent`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          },
          body: JSON.stringify({ parent: parent }),
        });

        const json = await response.json();

        window.location.reload();
      }

      const generateTable = () => {
        const modal = $('#chooseParentModal');
        const searchInput = modal.find('[type="search"]').val();

        modal.find('tbody').empty();

        fetchDataTable(searchInput).then(table => {
          // console.log('getDataTable', table);
          if (!!searchInput) {
            table.data?.forEach(item => {
              modal.find('tbody').append(makeTableRow(item));
            });
          } else {
            table.data?.data?.forEach(item => {
              modal.find('tbody').append(makeTableRow(item));
            });
          }
        });
      }

      $(function () {
        $('#chooseParentModal').on('show.bs.modal', e => {
          const appsModal = $('#appsModal');
          const id = appsModal.find('[name="id"]').val();
          const appName = appsModal.find('[name="name"]').val();

          $(this).find('[name="id"]').val(id);
          $(this).find('[name="name"]').val(appName);

          generateTable();
        });
      });
</script>
@endpush
@endsection