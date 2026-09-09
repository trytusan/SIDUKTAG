<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    use HasFactory;

    protected $table = 'berita';

    protected $fillable = [
        'judul',
        'slug',
        'kategori',
        'ringkasan',
        'konten',
        'gambar',
        'status',
        'penulis',
        'tanggal_publikasi',
        'views',
    ];

    protected $casts = [
        'tanggal_publikasi' => 'date:Y-m-d',
        'views' => 'integer',
    ];

    /**
     * Scope untuk berita yang berstatus terbit (Published).
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'Published');
    }

    /**
     * Scope filter per kategori.
     */
    public function scopeByKategori($query, $kategori)
    {
        if (!empty($kategori) && $kategori !== 'Semua') {
            return $query->where('kategori', $kategori);
        }
        return $query;
    }
}

