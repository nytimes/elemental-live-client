import ElementalClient from '../lib/elemental-client';

describe('integration tests', () => {
  const test = process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_HOST ? it : it.skip;
  const client = new ElementalClient(process.env.ELEMENTAL_CLIENT_INTEGRATION_TESTS_HOST);
  let eventsToClean = [];

  beforeEach(() => {
    eventsToClean.forEach((el) => client.liveEvents().delete(el));
    eventsToClean = [];
  });

  test('create, get, start, stop and reset a live event', () => {
    const eventParams = {
      'live_event': {
        'name': `integration-tests-${Math.random()}`,
        'input': {
          'file_input': {
            'uri': '/some/video/file.mov',
          },
        },
        'stream_assembly': {
          'name': 'stream1',
          'video_description': {
            'anti_alias': true,
            'width': 1280,
            'height': 720,
            'codec': 'h.264',
            'video_preprocessors': {
              'deinterlace_mode': 'Adaptive',
            },
          },
          'audio_description': {
            'codec': 'aac',
            'aac_settings': {
              'bitrate': 64000,
              'channels': 2,
              'sample_rate': 44100,
              'rate_control_mode': 'CBR',
            },
          },
        },
        'output_groups': [],
      },
    };

    return client.liveEvents().create(eventParams).
      then((data) => {
        console.log(data);
      });
  });
});
