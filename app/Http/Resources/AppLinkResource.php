<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppLinkResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'urusan_id' => $this->urusan_id,
            'category_id' => $this->category_id,
            'parent' => $this->parent,
            'code' => $this->code,
            'name' => $this->name,
            'alias' => $this->alias,
            'description' => $this->description,
            'url' => $this->url,
            'icon' => $this->icon,
            'image' => is_null($this->image) ? null : asset("storage/apps/{$this->image}"),
            'is_active' => $this->is_active,
            'is_sso' => $this->is_sso,
            'is_popular' => $this->is_popular,
            'visit_count' => (int) ($this->visit_count ?? 0),
            'last_visited_at' => optional($this->last_visited_at)?->toIso8601String(),
            'app_from' => $this->whenLoaded('app_from', fn($app_from) => [
                'id' => $app_from->id,
                'name' => $app_from->name,
            ]),
            'urusan' => $this->whenLoaded('urusan', fn($urusan) => [
                'id' => $urusan->id,
                'title' => $urusan->title,
            ]),
            'category' => $this->whenLoaded('category', fn($category) => [
                'id' => $category->id,
                'title' => $category->title,
                'sub_title' => $category->sub_title,
            ]),
            'mobile_route' => $this->mobile_route,
        ];
    }
}
