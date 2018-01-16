<?php

namespace App;

class ExitConfirmer extends BaseModel
{
    protected $table = 'exit_confirmers';

    protected $primaryKey = 'exit_confirmer_id';

    protected $fillable = [
        'id_name'
    ];

    public function usedCompany()
    {
        return $this->belongsTo('App\UsedCompany', 'used_company_id');
    }
}
