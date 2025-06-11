export const comfyuiWorkflow = {
  "6": {
    "inputs": {
      "text": "IMG_1016.CR2, candid photography of one woman called tinaai in a museum,  she is walking through the modern white museum looking at classic french art, skylight, amateur photography, shot on iphone, dynamic shot, motion blur, light smile, she marvels at the art, close up of her face",
      "clip": [
        "11",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Positive Prompt)"
    }
  },
  "8": {
    "inputs": {
      "samples": [
        "13",
        0
      ],
      "vae": [
        "10",
        0
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "10": {
    "inputs": {
      "vae_name": "ae.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "Load VAE"
    }
  },
  "11": {
    "inputs": {
      "clip_name1": "t5xxl_fp16.safetensors",
      "clip_name2": "clip_l.safetensors",
      "type": "flux",
      "device": "default"
    },
    "class_type": "DualCLIPLoader",
    "_meta": {
      "title": "DualCLIPLoader"
    }
  },
  "12": {
    "inputs": {
      "unet_name": "flux1-dev.safetensors",
      "weight_dtype": "default"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "Load Diffusion Model"
    }
  },
  "13": {
    "inputs": {
      "noise": [
        "25",
        0
      ],
      "guider": [
        "22",
        0
      ],
      "sampler": [
        "16",
        0
      ],
      "sigmas": [
        "67",
        0
      ],
      "latent_image": [
        "27",
        0
      ]
    },
    "class_type": "SamplerCustomAdvanced",
    "_meta": {
      "title": "SamplerCustomAdvanced"
    }
  },
  "16": {
    "inputs": {
      "sampler_name": "deis"
    },
    "class_type": "KSamplerSelect",
    "_meta": {
      "title": "KSamplerSelect"
    }
  },
  "17": {
    "inputs": {
      "scheduler": "beta",
      "steps": 35,
      "denoise": 1,
      "model": [
        "30",
        0
      ]
    },
    "class_type": "BasicScheduler",
    "_meta": {
      "title": "BasicScheduler"
    }
  },
  "22": {
    "inputs": {
      "model": [
        "30",
        0
      ],
      "conditioning": [
        "26",
        0
      ]
    },
    "class_type": "BasicGuider",
    "_meta": {
      "title": "BasicGuider"
    }
  },
  "25": {
    "inputs": {
      "noise_seed": 891324517745075
    },
    "class_type": "RandomNoise",
    "_meta": {
      "title": "RandomNoise"
    }
  },
  "26": {
    "inputs": {
      "guidance": 3,
      "conditioning": [
        "6",
        0
      ]
    },
    "class_type": "FluxGuidance",
    "_meta": {
      "title": "FluxGuidance"
    }
  },
  "27": {
    "inputs": {
      "width": 1280,
      "height": 720,
      "batch_size": 1
    },
    "class_type": "EmptySD3LatentImage",
    "_meta": {
      "title": "EmptySD3LatentImage"
    }
  },
  "30": {
    "inputs": {
      "max_shift": 1.15,
      "base_shift": 0.5,
      "width": 1280,
      "height": 720,
      "model": [
        "12",
        0
      ]
    },
    "class_type": "ModelSamplingFlux",
    "_meta": {
      "title": "ModelSamplingFlux"
    }
  },
  "42": {
    "inputs": {
      "text": "",
      "clip": [
        "11",
        0
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Negative Prompt)"
    }
  },
  "64": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "65",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "65": {
    "inputs": {
      "samples": [
        "73",
        1
      ],
      "vae": [
        "10",
        0
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "66": {
    "inputs": {
      "noise": [
        "71",
        0
      ],
      "guider": [
        "22",
        0
      ],
      "sampler": [
        "16",
        0
      ],
      "sigmas": [
        "67",
        1
      ],
      "latent_image": [
        "68",
        0
      ]
    },
    "class_type": "SamplerCustomAdvanced",
    "_meta": {
      "title": "SamplerCustomAdvanced"
    }
  },
  "67": {
    "inputs": {
      "denoise": 0.45,
      "sigmas": [
        "17",
        0
      ]
    },
    "class_type": "SplitSigmasDenoise",
    "_meta": {
      "title": "SplitSigmasDenoise"
    }
  },
  "68": {
    "inputs": {
      "noise_seed": 0,
      "noise_strength": 2.25,
      "normalize": "false",
      "latent": [
        "13",
        0
      ]
    },
    "class_type": "InjectLatentNoise+",
    "_meta": {
      "title": "🔧 Inject Latent Noise"
    }
  },
  "69": {
    "inputs": {
      "samples": [
        "66",
        1
      ],
      "vae": [
        "10",
        0
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "70": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "85",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "71": {
    "inputs": {},
    "class_type": "DisableNoise",
    "_meta": {
      "title": "DisableNoise"
    }
  },
  "73": {
    "inputs": {
      "noise": [
        "25",
        0
      ],
      "guider": [
        "22",
        0
      ],
      "sampler": [
        "16",
        0
      ],
      "sigmas": [
        "17",
        0
      ],
      "latent_image": [
        "27",
        0
      ]
    },
    "class_type": "SamplerCustomAdvanced",
    "_meta": {
      "title": "SamplerCustomAdvanced"
    }
  },
  "79": {
    "inputs": {
      "scale": 0.3,
      "strength": 0.34,
      "saturation": 0.6,
      "toe": 0,
      "seed": 233641896702998,
      "image": [
        "85",
        0
      ]
    },
    "class_type": "BetterFilmGrain",
    "_meta": {
      "title": "Better Film Grain"
    }
  },
  "80": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "79",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "85": {
    "inputs": {
      "upscale_by": 2,
      "seed": 519221671988204,
      "steps": 25,
      "cfg": 1,
      "sampler_name": "deis",
      "scheduler": "beta",
      "denoise": 0.25,
      "mode_type": "Linear",
      "tile_width": 1024,
      "tile_height": 1024,
      "mask_blur": 8,
      "tile_padding": 32,
      "seam_fix_mode": "None",
      "seam_fix_denoise": 1,
      "seam_fix_width": 64,
      "seam_fix_mask_blur": 8,
      "seam_fix_padding": 16,
      "force_uniform_tiles": false,
      "tiled_decode": false,
      "image": [
        "69",
        0
      ],
      "model": [
        "30",
        0
      ],
      "positive": [
        "6",
        0
      ],
      "negative": [
        "42",
        0
      ],
      "vae": [
        "10",
        0
      ],
      "upscale_model": [
        "86",
        0
      ]
    },
    "class_type": "UltimateSDUpscale",
    "_meta": {
      "title": "Ultimate SD Upscale"
    }
  },
  "86": {
    "inputs": {
      "model_name": "4x-ClearRealityV1.pth"
    },
    "class_type": "Upscale Model Loader",
    "_meta": {
      "title": "Upscale Model Loader"
    }
  },
  "88": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "69",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  }
};
