<?php
/**
 * Created by PhpStorm.
 * User: sereiponna
 * Date: 12/30/17
 * Time: 10:13 AM
 */

namespace App\utilities;


class Transformer
{
    public static function toHalfWidth($str)
    {
        return mb_convert_kana($str, 'a');
    }

    public static function filterPhoneNumber($str)
    {
        return preg_replace('([-()\s])', '', $str);
    }
}