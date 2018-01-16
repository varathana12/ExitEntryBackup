<?php

namespace App;

class ReceptionPhone extends BaseModel
{
    protected $table = 'reception_phone_numbers';

    protected $primaryKey = 'reception_phone_id';

    protected $fillable = ['reception_phone_number'];

    public function usedCompany() {
        return $this->belongsTo('App\UsedCompany', 'used_company_id');
    }
}
