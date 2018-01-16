<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsedCompany extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    protected $primaryKey = 'used_company_id';

    protected $fillable = [];

    public function visitors()
    {
        return $this->hasMany('App\Visitor', 'used_company_id');
    }

    public function receptionPhone()
    {
        return $this->hasMany('App\ReceptionPhone', 'used_company_id');
    }

    public function entryExitInfos()
    {
        return $this->hasMany('App\EntryExitInformation', 'used_company_id');
    }

    public function admins()
    {
        return $this->hasMany('App\Administrator', 'used_company_id');
    }

    public function exitConfirmers()
    {
        return $this->hasMany('App\ExitConfirmer', 'used_company_id');
    }
}
