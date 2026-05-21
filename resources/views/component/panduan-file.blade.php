<!-- Panduan Tabs File -->
<div class="tab-pane p-3 fade show active" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
    <div class="fs-5 fw-semibold my-3">
        File Panduan
    </div>
    <div class="row align-items-stretch">
        @foreach ($data as $item)
            <div class="file-list-parent">
                <a href="/{{ $item->asset_file }}" class="file-list-a" target="_blank" data-bs-title="{{ $item->name_file }}">
                    <div class="file-list-div">
                        <i class="file-list-logo bi bi-filetype-{{ $item->typefile }} text-danger"></i>
                        <span class="file-list-title">{{ $item->name_file }}</span>
                        <span class="file-list-desk">{{ $item->description }}</span>
                    </div>
                </a>
            </div>
        @endforeach
    </div>
</div>