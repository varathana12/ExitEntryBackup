<?php

namespace App;

class Visitor extends BaseModel
{
    protected $primaryKey = 'member_id';

    protected $fillable = [
        'company_name', 'name', 'phone_number', 'email_address'
    ];

    public function usedCompany()
    {
        return $this->belongsTo('App\UsedCompany', 'used_company_id');
    }

    public function entryExitInfo()
    {
        return $this->hasMany('App\EntryExitInformation', 'member_id');
    }
}
