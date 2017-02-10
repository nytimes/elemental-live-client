import ElementalClient from '../lib/elemental-client';

describe('integration tests', () => {
  const test = process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_HOST ? it : it.skip;
  const client = new ElementalClient(process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_HOST);
  let eventsToClean = [];

  afterEach(() => {
    const promises = eventsToClean.map((el) =>
      client.liveEvents().cancelEvent(el).
      then(() => client.liveEvents().delete(el)).
      catch(() =>
        client.liveEvents().resetEvent(el).
        then(() => client.liveEvents().delete(el)))
    );

    return Promise.all(promises).
      then(() => {
        eventsToClean = [];
      });
  });

  test('create, get, start, stop and reset a live event using file input', () => {
    const rand = Math.random();
    const fileInput = process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_FILE_INPUT
      ? process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_FILE_INPUT
      : '/some/source/file.mov';
    const destinationURI = process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_DESTINATION_URI
      ? process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_DESTINATION_URI
      : `https://post.host.example.com/integration-tests-${rand}/master`;
    const eventParams = {
      'live_event': {
        'name': `integration-tests-${rand}`,
        'input': {
          'file_input': {
            'uri': fileInput,
          },
        },
        'stream_assembly': [
          {
            'name': 'stream1',
            'video_description': {
              'anti_alias': true,
              'width': 1280,
              'height': 720,
              'codec': 'h.264',
              'video_preprocessors': {
                'deinterlacer': {
                  'deinterlace_mode': 'Adaptive',
                },
              },
            },
            'audio_description': {
              'codec': 'aac',
              'aac_settings': {
                'bitrate': 96000,
                'sample_rate': 44100,
                'rate_control_mode': 'CBR',
                'profile': 'LC',
              },
            },
          },
          {
            'name': 'stream2',
            'video_description': {
              'anti_alias': true,
              'width': 854,
              'height': 480,
              'codec': 'h.264',
              'video_preprocessors': {
                'deinterlacer': {
                  'deinterlace_mode': 'Adaptive',
                },
              },
            },
            'audio_description': {
              'codec': 'aac',
              'aac_settings': {
                'bitrate': 96000,
                'sample_rate': 44100,
                'rate_control_mode': 'CBR',
                'profile': 'LC',
              },
            },
          },
        ],
        'output_group': [
          {
            'order': 1,
            'type': 'apple_live_group_settings',
            'apple_live_group_settings': {
              'cdn': 'Akamai',
              'floating_point_manifest': true,
              'keep_segments': 500,
              'segment_length': 3,
              'segments_per_subdirectory': 3000,
              'use_subdirectories': true,
              'vod_mode': true,
              'destination': {
                'uri': destinationURI,
              },
            },
            'output': [
              {
                'extension': 'm3u8',
                'name_modifier': '_480p',
                'order': 1,
                'stream_assembly_name': 'stream2',
                'container': 'm3u8',
              },
              {
                'extension': 'm3u8',
                'name_modifier': '_720p',
                'order': 2,
                'stream_assembly_name': 'stream1',
                'container': 'm3u8',
              },
            ],
          },
        ],
      },
    };

    return client.liveEvents().create(eventParams).
      then((data) => {
        const id = data.live_event.id;
        const le = client.liveEvents();

        eventsToClean.push(id);

        return le.retrieve(id).
          then((retrieveData) => le.startEvent(retrieveData.live_event.id)).
          then((startData) => le.stopEvent(startData.live_event.id)).
          then((stopData) => le.resetEvent(stopData.live_event.id));
      });
  });

  test('create, get and delete schedule', () => {
    const interval = 15 * 60 * 1000;
    const now = new Date();
    const fileInput = process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_FILE_INPUT
      ? process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_FILE_INPUT
      : '/some/source/file.mov';
    const scheduleParams = {
      schedule: {
        name: `scheduled-event-${Math.random()}`,
        input: {
          'file_input': {
            'uri': fileInput,
          },
        },
        'start_time': ElementalClient.formatDate(new Date(now.getTime() + interval)),
        'end_type': 'duration',
        'duration': 120,
        'until': 'forever',
      },
    };

    return client.liveEventProfiles().list().
      then((data) => {
        const profile = Array.isArray(data.live_event_profile_list.live_event_profile)
          ? data.live_event_profile_list.live_event_profile[0]
          : data.live_event_profile_list.live_event_profile;

        scheduleParams.schedule.profile = ElementalClient.extractIdFromHref(profile);

        return client.schedules().create(scheduleParams);
      }).
      then((data) => client.schedules().delete(data.schedule.id));
  });
});
