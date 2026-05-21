<div class="py-4 bg-light">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-4">
          <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h4 class="my-0 fw-bold">Agenda Pemerintah</h4>
            <div id="filterWrapper" class="d-flex flex-wrap gap-1">
              <div>
                <button class="btn btn-light btn-sm" onclick="handleOnClick(this, 1)">Hari ini</button>
              </div>
              <div>
                <button class="btn btn-light btn-sm active" onclick="handleOnClick(this, 2)">Minggu</button>
              </div>
              <div>
                <button class="btn btn-light btn-sm" onclick="handleOnClick(this, 3)">Bulan</button>
              </div>
            </div>
          </div>
          <div class="card-simalik-wrapper">
            <div id="cardPemerintah" class="card-simalik"></div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h4 class="my-0 fw-bold">Agenda Publik</h4>
          <div class="d-flex flex-wrap gap-1">
            <div>
              <button id="btnFilter" class="btn btn-light btn-sm">Hari ini</button>
            </div>
            <div>
              <button id="btnFilter" class="btn btn-light btn-sm active">Minggu</button>
            </div>
            <div>
              <button id="btnFilter" class="btn btn-light btn-sm">Bulan</button>
            </div>
          </div>
        </div>

        <div class="card-simalik-wrapper">
          <div class="card-simalik">
            <div class="card-agenda">
              <h6 class="fw-bold text-primary-emphasis">{{ 'Kediri Night Carnival' }}</h6>
              <div class="mb-2 d-flex align-items-start gap-2">
                <i class="bi bi-geo-alt-fill text-muted opacity-50"></i>
                <small class="my-0">{{ 'Stadion Brawijaya' }}</small>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-1 d-flex align-items-start gap-2" data-bs-toggle="tooltip" data-bs-title="Narasumber">
                    <i class="bi bi-person-fill text-muted opacity-50"></i>
                    <p class="my-0">{{ 'PJ. Walikota Kediri' }}</p>
                  </div>
                  <div class="d-flex align-items-start gap-2" data-bs-toggle="tooltip" data-bs-title="OPD">
                    <i class="bi bi-buildings text-muted opacity-50"></i>
                    <small style="margin-top: 1px;">{{ 'Disbudpora' }}</small>
                  </div>
                </div>
                <div class="col-md-6 border-start border-primary-subtle">
                  <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-alarm-fill text-muted opacity-50"></i>
                    <div class="d-flex flex-column gap-0">
                      <p class="my-0">{{ '24 Agustus 2024' }}</p>
                      <p class="my-0">Pukul {{ '19:00' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

@push('script')
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment-with-locales.min.js"></script>
<script>
  function renderHtml(item) {
    const eventSchedule = item.tgl_kegiatan + ' ' + item.waktu_kegiatan;
    const eventDate = moment(eventSchedule).format('DD MMMM YYYY');
    const eventTime = moment(eventSchedule).format('HH:mm');

    return `
      <div class="card-agenda">
        <h6 class="fw-bold text-primary-emphasis">${item.nama}</h6>
        <div class="mb-2 d-flex align-items-start gap-2">
          <i class="bi bi-geo-alt-fill text-muted opacity-50"></i>
          <small class="my-0">${item.tempat ?? '-'}</small>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-1 d-flex align-items-start gap-2" data-bs-toggle="tooltip" data-bs-title="Narasumber">
              <i class="bi bi-megaphone-fill text-muted opacity-50"></i>
              <p class="my-0">${item.narasumber == '' ? '-' : item.narasumber}</p>
            </div>
            <div class="mb-1 d-flex align-items-start gap-2" data-bs-toggle="tooltip" data-bs-title="Peserta">
              <i class="bi bi-people-fill text-muted opacity-50"></i>
              <p class="my-0">${item.peserta == '' ? '-' : item.peserta}</p>
            </div>
            <div class="d-flex align-items-start gap-2" data-bs-toggle="tooltip" data-bs-title="OPD">
              <i class="bi bi-buildings text-muted opacity-50"></i>
              <small style="margin-top: 1px;">${item.opd ?? '-'}</small>
            </div>
          </div>
          <div class="col-md-6 border-start border-primary-subtle">
            <div class="d-flex align-items-start gap-2">
              <i class="bi bi-alarm-fill text-muted opacity-50"></i>
              <div class="d-flex flex-column gap-0">
                <p class="my-0">${eventDate}</p>
                <p class="my-0">Pukul ${eventTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function fetchDataAgenda(event, id) {
    $(event).addClass('active');
    $('#cardPemerintah').empty();

    try {
      const response = await fetch(`/api/agenda?id=${id}`);
      const body = await response.json();
      if (body?.data?.length > 0) {
        body?.data?.forEach(item => {
          $('#cardPemerintah').append(
            renderHtml(item)
          );
        });
      } else {
        $('#cardPemerintah').append(`
          <div class="card-agenda text-center">
            <div class="mb-3">
              <i class="bi bi-info-circle-fill fs-3 text-muted"></i>
            </div>
            <p>Tidak ada agenda untuk penelusuran ini.</p>
          </div>
        `);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function handleOnClick(event, id) {
    $('#filterWrapper .active').removeClass('active');
    fetchDataAgenda(event, id);
  }

  $(function () {
    fetchDataAgenda(this, 2);
  });
</script>
@endpush