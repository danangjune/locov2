<div class="modal fade" id="appsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="appsModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="appsModalLabel">Form Aplikasi &amp; Layanan</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form enctype="multipart/form-data">
          @csrf

          <input type="hidden" name="id">
          <input type="hidden" name="code_parent" value="">

          <div id="parent" class="row">
            <div class="col-12">
              <p class="mb-2 small fw-bold text-muted">Data Aplikasi Induk</p>
            </div>
            <div class="col-12">
              <div class="input-group mb-3">
                <div class="form-floating">
                  <input type="text" readonly disabled name="name_parent" value="" placeholder="" class="form-control border-0">
                  <label>Nama Aplikasi</label>
                </div>
                <span class="input-group-text border-0 px-3 bg-warning cursor-pointer" data-bs-toggle="modal" data-bs-target="#chooseParentModal">
                  <i class="bi bi-pencil text-warning-emphasis" data-bs-toggle="tooltip" data-bs-title="Ubah data Aplikasi Layanan Induk"></i>
                </span>
              </div>
            </div>

            <div class="col-12">
              <hr />
              <p class="mb-2 small fw-bold text-muted">Lengkapi inputan dibawah ini</p>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="text" name="name" placeholder="" class="form-control">
                <label>Nama Aplikasi</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="text" name="alias" placeholder="" class="form-control">
                <label>Alias</label>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <textarea name="description" class="form-control" placeholder="" style="height: 80px"></textarea>
                <label>Deskripsi</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="text" name="icon" value="fa-" placeholder="" class="form-control">
                <label>Icon (Font Awesome)</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="file" name="image" class="form-control">
                <label>Image</label>
                <div id="prev-image"></div>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <input type="text" name="url" value="https://" placeholder="" class="form-control">
                <label>URL</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <select name="category_id" class="form-select">
                  <option value="">Pilih Kategori</option>
                  @foreach ($categories as $item)
                    <option value="{{ $item->id }}">{{ $item->title }}</option>
                  @endforeach
                </select>
                <label>Pilih Kategori</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <select name="urusan_id" class="form-select">
                  <option value="" selected disabled>Pilih Urusan</option>
                  @foreach ($urusan as $item)
                    <option value="{{ $item->id }}">{{ $item->title }}</option>
                  @endforeach
                </select>
                <label>Pilih Urusan</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Status Aktif :</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" name="is_active" role="switch" id="switchActive" checked>
                  <label class="form-check-label" for="switchActive">Active / Inactive</label>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Login with SSO :</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" name="is_sso" role="switch" id="switchSSO">
                  <label class="form-check-label" for="switchSSO">Yes / No</label>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Asal Aplikasi :</label>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" name="app_from_id" role="switch" id="app_from_id">
                  <label class="form-check-label" for="app_from_id">Pusat / Lokal</label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
        <button type="button" id="btnSubmit" class="btn btn-subtle-primary" onclick="handleSubmit(this)">Submit</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="chooseParentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="chooseParentModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="chooseParentModalLabel">Pilih data Induk</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-floating mb-3">
              <input type="text" name="id" placeholder="" readonly class="form-control-plaintext">
              <label>ID Aplikasi</label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating mb-3">
              <input type="text" name="name" placeholder="" readonly class="form-control-plaintext">
              <label>Nama Aplikasi</label>
            </div>
          </div>
        </div>

        <div class="mb-3 d-flex align-items-center gap-2">
          <div class="input-group">
            <span class="input-group-text bg-secondary-subtle">
              <i class="bi bi-search"></i>
            </span>
            <input type="search" class="form-control bg-secondary-subtle" placeholder="Search...">
          </div>
          <button type="button" class="btn btn-subtle-success" onclick="generateTable()">Cari</button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-sm">
            <thead>
              <tr>
                <th>Pilih</th>
                <th>ID</th>
                <th>Nama Aplikasi</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
