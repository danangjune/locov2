@foreach ($data as $child)
  <tr @class(['small', 'table-danger' => !$child->is_active])>
    <td class="ps-4">
      <div class="d-flex align-items-center gap-1">
        <i class="bi bi-arrow-return-right"></i>
        <button class="btn btn-subtle-warning btn-sm" data-edit="{{ $child->id }}" data-bs-toggle="modal" data-bs-target="#appsModal">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-subtle-danger btn-sm" id="{{ $child->id }}" onclick="handleDestroy(this.id)">
          <i class="bi bi-trash"></i>
        </button>
        <button data-id="{{ $child->id }}" data-bs-toggle="modal" data-bs-target="#appsModal" class="btn btn-subtle-success btn-sm">
          <i class="bi bi-plus"></i>
        </button>
      </div>
    </td>
    <td class="ps-4 text-success">
      <div class="ps-0 text-nowrap">
        <i class="bi bi-arrow-return-right"></i>
        <span>{{ $child->id }}</span>
      </div>
    </td>
    <td class="text-success">{{ strip_tags($child->name) }}</td>
    <td class="text-success">
      <span class="badge bg-secondary">{{ $child->urusan->title }}</span>
    </td>
    <td class="text-success">
      <span class="badge bg-secondary">{{ $child->category->title }}</span>
    </td>
    <td class="fw-bold">{{ $child->is_active ? 'Active' : 'Inactive' }}</td>
    <td class="fw-bold">{{ $child->is_sso ? 'SSO' : '-' }}</td>
    <td class="fw-bold">
      <span class="badge @if ($child->app_from_id == 2) bg-primary @else bg-secondary @endif">{{ $child->app_from->name }}</span>
    </td>
  </tr>
@endforeach