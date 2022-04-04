<?php

namespace Flynt\Components\BlockMap;

use Flynt\FieldVariables;
use Flynt\Utils\Options;

add_filter('Flynt/addComponentData?name=BlockMap', function ($data) {
    $translatableOptions = Options::getTranslatable('MapOptions');
    $data['jsonData'] = [
        'options' => array_merge($translatableOptions, $data['options']),
        'items' => array_merge($translatableOptions, $data['items']),
    ];
    return $data;
});

function getACFLayout()
{
    return [
        'name' => 'BlockMap',
        'label' => 'Block: Add Offices',
        'sub_fields' => [
            [
                'label' => __('General', 'flynt'),
                'name' => 'generalTab',
                'type' => 'tab',
                'placement' => 'top',
                'endpoint' => 0
            ],
            [
                'label' => __('Title', 'flynt'),
                'name' => 'preContentHtml',
                'type' => 'wysiwyg',
                'tabs' => 'visual,text',
                'media_upload' => 0,
                'instructions' => __('Want to add a headline? And a paragraph? Go ahead! Or just leave it empty and nothing will be shown.', 'flynt'),
                'delay' => 1,
            ],
            [
                'label' => __('Items', 'flynt'),
                'name' => 'items',
                'type' => 'repeater',
                'collapsed' => '',
                'layout' => 'block',
                'button_label' => 'Add',
                'sub_fields' => [
                    [
                        'label' => __('Title', 'flynt'),
                        'name' => 'title',
                        'type' => 'text',
                        'wrapper' => [
                            'width' => 100
                        ],
                    ],
                    [
                        'label' => __('Content', 'flynt'),
                        'name' => 'contentHtml',
                        'type' => 'wysiwyg',
                        'tabs' => 'visual,text',
                        'media_upload' => 0,
                        'delay' => 1,
                        'wrapper' => [
                            'width' => 100
                        ],
                    ],
                    [
                        'label' => __('Latitude', 'flynt'),
                        'name' => 'lat',
                        'type' => 'number',
                        'wrapper' => [
                            'width' => 50
                        ],
                    ],
                    [
                        'label' => __('Longitude', 'flynt'),
                        'name' => 'lon',
                        'type' => 'number',
                        'wrapper' => [
                            'width' => 50
                        ],
                    ],
                ]
            ],
            [
                'label' => __('Options', 'flynt'),
                'name' => 'optionsTab',
                'type' => 'tab',
                'placement' => 'top',
                'endpoint' => 0
            ],
            [
                'label' => '',
                'name' => 'options',
                'type' => 'group',
                'layout' => 'row',
                'sub_fields' => [
                    [
                        'label' => __('Bullet Color', 'flynt'),
                        'name' => 'bullet',
                        'type' => 'color_picker',
                        'default_value' => "#000",

                    ],
                    FieldVariables\getTheme()
                ]
            ]
        ]
    ];
}
